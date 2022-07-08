import { useLayoutEffect, useMemo, useRef, useState } from "react";

type EventListener = (...args: any[]) => void;
export type EventEmitter = {
  subscribe(fn: EventListener): () => void;
};

type SWRRequest = {
  id: number;
  key: string;
  type: "success" | "error" | "discarded" | "ongoing";
  startTime: Date;
  endTime: Date | null;
  data?: any;
  error?: any;
};

export type RequestsById = Record<string, SWRRequest[]>;

export function useRequests(events: EventEmitter | null) {
  const [requestsById, setRequestsById] = useState<RequestsById>({});
  const activeRequestsRef = useRef<Record<number | string, SWRRequest>>({});

  useLayoutEffect(() => {
    // Which channel does this request belong to.
    const idMap: Record<number, string> = {};
    if (events === null) return;

    return events.subscribe(
      (
        type,
        {
          id,
          key,
          data,
          error,
        }: { id: number; key: string; data?: any; error?: any }
      ) => {
        setRequestsById((currentRequestsByKey) => {
          let channelKey = key;
          let channelNum = 0;

          let currentRequests;
          const activeRequests = activeRequestsRef.current;

          switch (type) {
            case "request_start":
              // There can be only 1 ongoing request at a time for each channel. Move it to a new one.
              while (activeRequests[channelKey]) {
                channelKey = `${key}-${++channelNum}`;
              }

              currentRequests = currentRequestsByKey[channelKey] || [];

              activeRequests[id] = {
                id,
                key,
                type: "ongoing",
                startTime: new Date(),
                endTime: null,
              };
              activeRequests[channelKey] = activeRequests[id];

              currentRequests.push(activeRequests[id]);
              idMap[id] = channelKey;

              // Always mutate the object.
              return {
                ...currentRequestsByKey,
                [channelKey]: currentRequests,
              };
            case "request_success":
              if (activeRequests[id]) {
                channelKey = idMap[id];

                activeRequests[id].type = "success";
                activeRequests[id].endTime = new Date();
                activeRequests[id].data = data;

                delete activeRequests[id];
                delete activeRequests[channelKey];

                return { ...currentRequestsByKey };
              }
              break;
            case "request_error":
              if (activeRequests[id]) {
                channelKey = idMap[id];

                activeRequests[id].type = "error";
                activeRequests[id].endTime = new Date();
                activeRequests[id].error = error;
                delete activeRequests[id];
                delete activeRequests[channelKey];

                return { ...currentRequestsByKey };
              }
              break;
            case "request_discarded":
              if (activeRequests[id]) {
                channelKey = idMap[id];

                activeRequests[id].type = "discarded";
                activeRequests[id].endTime = new Date();
                delete activeRequests[id];
                delete activeRequests[channelKey];

                return { ...currentRequestsByKey };
              }
              break;
          }
          return currentRequestsByKey;
        });
      }
    );
  }, [events]);

  return requestsById;
}

export const useTracks = (requestsById: RequestsById) => {
  return useMemo(() => {
    const t: any[] = [];

    [...Object.entries(requestsById)].forEach(([channelKey, requests]) => {
      const title = requests[0] ? requests[0].key : channelKey;
      const shouldMergeKey = requests[0] && channelKey !== requests[0].key;

      t.push({
        key: channelKey,
        data: {
          title,
          shouldMergeKey,
        },
        items: requests.map((request) => {
          return {
            key: request.id,
            data: request,
            start: request.startTime.getTime(),
            end: (request.endTime || new Date()).getTime(),
          };
        }),
      });
    });

    t.sort((a, b) => {
      if (a.data.title < b.data.title) return -1;
      if (a.data.title > b.data.title) return 1;
      return 0;
    });

    // Re-assign indexes.
    t.forEach((t_, i) => {
      t_.data.index = i;
    });

    return t;
  }, [requestsById]);
};
