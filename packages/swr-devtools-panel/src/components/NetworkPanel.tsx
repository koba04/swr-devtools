import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Cache } from "swr";

import { PanelType } from "./SWRDevToolPanel";
import { Timeline } from "./timeline";

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
};

function useRequests(events: EventEmitter) {
  const [requestsById, setRequestsById] = useState<
    Record<string, SWRRequest[]>
  >({});
  const activeRequestsRef = useRef<Record<number | string, SWRRequest>>({});

  useLayoutEffect(() => {
    // Which channel does this request belong to.
    const idMap: Record<number, string> = {};

    return events.subscribe(
      (type, { id, key }: { id: number; key: string }) => {
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

function formatTime(time: number, step: number) {
  if (step >= 500) return time / 1000 + "s";
  if (time >= 10000) return time / 1000 + "s";
  return time + "ms";
}

export const NetworkPanel = ({
  cache,
  type,
  events,
}: {
  cache: Cache;
  events: EventEmitter;
  type: PanelType;
}) => {
  const startTime = useState(() => Date.now())[0];
  const requestsById = useRequests(events);
  const [requestDetail, setRequestDetail] = useState<null | string>(null);

  const tracks = React.useMemo(() => {
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

  const [trackScale, setTrackScale] = React.useState(5);
  const [timelineHoverX, setTimelineHoverX] = React.useState(-1);

  const [endTime, trackWidth] = React.useMemo(() => {
    const e = Date.now() + 500;
    return [e, (e - startTime) / (2 * trackScale)];
    // We have to include `requestsById` here just to refresh the
    // timeline whenever there's any udpate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestsById, startTime, trackScale]);

  const onPointerMove = useCallback((e) => {
    setTimelineHoverX(~~e.nativeEvent.offsetX + 100);
  }, []);

  const onPointerOut = useCallback(() => {
    setTimelineHoverX(-1);
  }, []);

  return (
    <PanelWrapper>
      {requestDetail ? (
        <Detail>
          {requestDetail}
          <button onClick={() => setRequestDetail(null)}>Close</button>
        </Detail>
      ) : null}
      <TimelineWrapper>
        <HeaderController>
          Network
          <Label>
            <ScaleInput
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={trackScale}
              onChange={(e) => setTrackScale(Number(e.target.value))}
            />
            Scale
          </Label>
        </HeaderController>
        <Timeline
          tracks={tracks}
          startTime={startTime}
          endTime={endTime}
          headerHeight={21}
          labelWidth={100}
          trackWidth={trackWidth}
          trackHeight={24}
          renderHeader={(startTime_, endTime_, scrollLeft, viewportWidth) => {
            // Linear scale
            const scales = [];
            const r = (endTime_ - startTime_) / trackWidth;
            const length = viewportWidth * r;

            const n = Math.floor(length / 100);
            const tStep = n < 30 ? 100 : n < 70 ? 500 : n < 300 ? 1000 : 2000;
            const steps = Math.ceil(length / tStep);
            const sStep = tStep / r;
            const offset = Math.floor((scrollLeft * r) / tStep) * tStep;

            let o = offset;
            let left = offset / r;
            for (let i = 0; i < steps; i++) {
              scales.push(
                <HeaderScaleTimestamp key={i} style={{ left }}>
                  {formatTime(o, tStep)}
                </HeaderScaleTimestamp>
              );
              o += tStep;
              left += sStep;
            }

            return (
              <>
                {timelineHoverX >= 0 ? (
                  <TimelineRuler style={{ left: timelineHoverX }} />
                ) : null}
                <Header>
                  <HeaderLabel>Keys</HeaderLabel>
                  <HeaderScale
                    onPointerMove={onPointerMove}
                    onPointerOut={onPointerOut}
                  >
                    {scales}
                  </HeaderScale>
                </Header>
              </>
            );
          }}
          renderItem={(item) => {
            return (
              <Request
                title={`(${item.data.type}) ` + item.data.key}
                type={item.data.type}
                onClick={() => setRequestDetail(JSON.stringify(item.data))}
              >
                {item.data.key}
              </Request>
            );
          }}
          renderTrack={(track, children) => {
            return <TrackRow i={track.data.index}>{children}</TrackRow>;
          }}
          renderTrackLabel={(track) => {
            return (
              <TrackLabel
                className="swr-devtools-track-label"
                i={track.data.index}
                title={track.data.title}
              >
                {track.data.shouldMergeKey ? "└ " : null}
                {track.data.title}
              </TrackLabel>
            );
          }}
        />
      </TimelineWrapper>
    </PanelWrapper>
  );
};

const PanelWrapper = styled.section`
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  padding: 0;
  height: 100%;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  border-top: solid 1px var(--swr-devtools-border-color);
  background-color: var(--swr-devtools-network-row-bg-color);
  overscroll-behavior: contain;
  font-size: 0.8rem;
  --swr-devtools-ongoing-request-background: #f5f5f5;
  --swr-devtools-success-request-background: #afefbb;
  --swr-devtools-error-request-background: #ffa7a7;
  --swr-devtools-discarded-request-background: #ccc;
`;

const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Request = styled.div<{
  type: "ongoing" | "success" | "error" | "discarded";
}>`
  text-overflow: ellipsis;
  overflow: hidden;
  height: 18px;
  line-height: 17px;
  padding: 0 5px;
  font-size: 11px;
  margin-top: 3px;
  border-radius: 9px;
  box-shadow: 0 0 0 1px #a3a3a324 inset;
  cursor: default;
  user-select: none;
  background: ${(props) =>
    `var(--swr-devtools-${props.type}-request-background)`};
  &:hover {
    box-shadow: 0 0 0 1px #0000003d inset;
  }
`;

const TrackRow = styled.div<{ i: number }>`
  height: 24px;
  min-width: 100%;
  ${(props) =>
    props.i % 2
      ? "background: var(--swr-devtools-network-row-bg-alt-color);"
      : ""}
  &:hover {
    background: var(--swr-devtools-network-hovered-row-bg-color);
  }
  &:hover .swr-devtools-track-label {
    color: var(--swr-devtools-text-color);
    background: var(--swr-devtools-network-hovered-row-bg-color);
  }
`;

const TrackLabel = styled.div<{ i: number }>`
  padding: 0 4px;
  height: 24px;
  line-height: 24px;
  color: var(--swr-devtools-timeline-track-color);
  border-right: 1px solid #8383835e;
  font-size: 11px;
  background: ${(props) =>
    props.i % 2
      ? "var(--swr-devtools-network-row-bg-alt-color)"
      : "var(--swr-devtools-network-row-bg-color)"};
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
  user-select: none;
  overflow: hidden;
`;

const Detail = styled.div`
  position: absolute;
  background: white;
  z-index: 2;
  height: 70%;
  top: 15%;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0 3px 10px #0000001a;
  border: 1px solid #0000001a;
  max-width: 500px;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  height: 20px;
  width: 100%;
  z-index: 2;
  cursor: default;
  user-select: none;
  background: var(--swr-devtools-network-panel-bg-color);
  box-shadow: 0 1px 2px #0000002e;
`;

const HeaderLabel = styled.div`
  position: sticky;
  display: inline-block;
  width: 99px;
  height: 20px;
  left: 0;
  line-height: 20px;
  box-sizing: border-box;
  padding: 0 4px;
  color: var(--swr-devtools-network-panel-color);
  background: var(--swr-devtools-network-panel-bg-color);
  z-index: 1;
`;

const HeaderScale = styled.div`
  display: inline-block;
  vertical-align: top;
  line-height: 20px;
  font-size: 10px;
  color: var(--swr-devtools-network-panel-color);
  position: absolute;
  overflow: hidden;
  width: calc(100% - 100px);
  height: 20px;
`;

const HeaderScaleTimestamp = styled.div`
  position: absolute;
  padding: 0 5px;
  border-left: 1px solid var(--swr-devtools-timeline-scale-color);
  top: 10px;
  height: 10px;
  line-height: 0px;
  white-space: nowrap;
  pointer-events: none;
`;

const HeaderController = styled.div`
  background: var(--swr-devtools-network-panel-bg-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  color: #999;
  font-size: 11px;
  user-select: none;
`;

const ScaleInput = styled.input`
  height: 6px;
  width: 50px;
`;

const Label = styled.label`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const TimelineRuler = styled.div`
  position: absolute;
  width: 1px;
  height: 100%;
  top: 20px;
  background: var(--swr-devtools-timeline-ruler-color);
  z-index: 1;
`;
