import React, { useCallback, useEffect } from "react";
import styled from "styled-components";

export type Item = {
  key: string;
  data: any;
  start: number;
  end: number;
};
export type Track = {
  key: string;
  data: any;
  items: Item[];
};
export type Tracks = Track[];

const isTrackVisible = (
  viewportTop: number,
  viewportHeight: number,
  trackHeight: number,
  trackIndex: number,
  margin: number,
): -1 | 0 | 1 => {
  // Before viewport
  if (trackHeight * (trackIndex + 1) < viewportTop - margin) return -1;
  // After viewport
  if (trackHeight * trackIndex > viewportTop + viewportHeight + margin)
    return 1;
  return 0;
};

const isItemVisible = (
  viewportLeft: number,
  viewportWidth: number,
  itemLeft: number,
  itemWidth: number,
  margin: number,
): -1 | 0 | 1 => {
  // Before viewport
  if (itemLeft + itemWidth < viewportLeft - margin) return -1;
  // After viewport
  if (itemLeft > viewportLeft + viewportWidth + margin) return 1;
  return 0;
};

// Find the starting index where it's tested value >= 0
const binarySearch = (
  left: number,
  right: number,
  test: (i: number) => -1 | 0 | 1,
) => {
  let l = left;
  let r = right;
  while (l + 1 < r) {
    const m = (l + r) >> 1;
    const v = test(m);
    if (v === -1) {
      l = m;
    } else {
      r = m;
    }
  }
  if (test(l) === -1) return r;
  return l;
};

const VIRTUAL_SCROLL_MARGIN = 50;

const TimelineItem: React.FC<{
  item: Item;
  left: number;
  width: number;
  rendererRefs: React.MutableRefObject<any>;
}> = React.memo(({ item, left, width, rendererRefs }) => {
  return (
    <TrackItem
      style={{
        left: `${left * 100}%`,
        width: `${width * 100}%`,
      }}
    >
      {rendererRefs.current.renderItem(item)}
    </TrackItem>
  );
});
TimelineItem.displayName = "TimelineItem";

const TimelineTrack: React.FC<{
  track: Track;
  trackWidth: number;
  labelWidth: number;
  top: number;
  startTime: number;
  endTime: number;
  areaLeft: number;
  areaWidth: number;
  rendererRefs: React.MutableRefObject<any>;
}> = React.memo(
  ({
    track,
    trackWidth,
    labelWidth,
    top,
    startTime,
    endTime,
    areaLeft,
    areaWidth,
    rendererRefs,
  }) => {
    const total = endTime - startTime;

    const ui: React.ReactNode[] = [];

    const test = (i: number) => {
      const item = track.items[i];
      const left = (item.start - startTime) / total;
      const width = ((item.end || endTime) - item.start) / total;
      return [
        left,
        width,
        isItemVisible(
          areaLeft,
          areaWidth,
          left * trackWidth,
          width * trackWidth,
          VIRTUAL_SCROLL_MARGIN,
        ),
      ] as const;
    };
    const startIndex = binarySearch(
      0,
      track.items.length - 1,
      (i) => test(i)[2],
    );

    for (let i = startIndex; i < track.items.length; i++) {
      const item = track.items[i];
      const [left, width, visible] = test(i);
      if (visible === 0) {
        ui.push(
          <TimelineItem
            key={item.key}
            item={item}
            left={left}
            width={width}
            rendererRefs={rendererRefs}
          />,
        );
      } else if (visible === 1) {
        break;
      }
    }

    return (
      <TrackContainer style={{ top }}>
        {rendererRefs.current.renderTrack(
          track,
          <>
            <TrackTitle style={{ width: labelWidth }}>
              {rendererRefs.current.renderTrackLabel(track)}
            </TrackTitle>
            <TrackContent style={{ width: trackWidth }}>{ui}</TrackContent>
          </>,
        )}
      </TrackContainer>
    );
  },
);
TimelineTrack.displayName = "TimelineTrack";

const debounced = (fn: (arg: any) => void, delay: number) => {
  let timer: any;
  return (arg: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(arg);
    }, delay);
  };
};

export const Timeline: React.FC<{
  tracks: Tracks;
  startTime: number;
  endTime: number;
  trackWidth: number;
  trackHeight: number;
  labelWidth: number;
  headerHeight: number;
  renderItem: (item: Item) => React.ReactNode;
  renderTrack: (track: Track, children: React.ReactNode) => React.ReactNode;
  renderTrackLabel: (track: Track) => React.ReactNode;
  renderHeader: (
    startTime: number,
    endTime: number,
    scrollLeft: number,
    viewportWidth: number,
  ) => React.ReactNode;
}> = ({
  tracks,
  trackWidth,
  trackHeight,
  labelWidth,
  headerHeight,
  startTime,
  endTime,
  renderItem,
  renderTrack,
  renderTrackLabel,
  renderHeader,
}) => {
  const ui: React.ReactNode[] = [];
  const [scroll, setScroll] = React.useState([0, 0]);
  const [viewport, setViewport] = React.useState([0, 0]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = React.useRef(true);
  const scrollDistanceToRightRef = React.useRef(0);

  const onScroll = React.useState(() => {
    return (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as unknown as HTMLDivElement;
      setScroll((s) => {
        if (s[0] !== target.scrollLeft) {
          scrollDistanceToRightRef.current = Math.max(
            0,
            scrollDistanceToRightRef.current - (target.scrollLeft - s[0]),
          );
          shouldAutoScrollRef.current = scrollDistanceToRightRef.current < 20;
        }
        return [target.scrollLeft, target.scrollTop];
      });
    };
  })[0];

  useEffect(() => {
    if (!containerRef.current) return;
    const onResize = debounced(({ width, height }) => {
      setViewport([width, height]);
    }, 200);
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) onResize(entries[0].contentRect);
    });
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const rendererRefs = React.useRef({
    renderItem,
    renderTrack,
    renderTrackLabel,
  });

  useEffect(() => {
    rendererRefs.current = {
      renderItem,
      renderTrack,
      renderTrackLabel,
    };
    scrollDistanceToRightRef.current = Math.max(
      0,
      trackWidth + labelWidth - viewport[0] - scroll[0],
    );
  });

  // Automatically scroll to the right.
  useEffect(() => {
    if (!containerRef.current) return;
    if (shouldAutoScrollRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [trackWidth]);

  const test = (i: number) => {
    return isTrackVisible(
      scroll[1],
      viewport[1],
      trackHeight,
      i,
      VIRTUAL_SCROLL_MARGIN,
    );
  };
  const startIndex = binarySearch(0, tracks.length - 1, test);

  for (let i = startIndex; i < tracks.length; i++) {
    const track = tracks[i];
    const visible = test(i);
    if (visible === 0) {
      ui.push(
        <TimelineTrack
          key={track.key}
          track={track}
          labelWidth={labelWidth}
          trackWidth={trackWidth}
          top={i * trackHeight + headerHeight}
          startTime={startTime}
          endTime={endTime}
          areaLeft={scroll[0]}
          areaWidth={viewport[0]}
          rendererRefs={rendererRefs}
        />,
      );
    } else if (visible === 1) {
      break;
    }
  }

  return (
    <TimelineContainer onScrollCapture={onScroll} ref={containerRef}>
      <TimelineContentWrapper
        style={{
          width: labelWidth + trackWidth,
          height: tracks.length * trackHeight,
        }}
      >
        {renderHeader(startTime, endTime, scroll[0], viewport[0])}
        {ui}
      </TimelineContentWrapper>
    </TimelineContainer>
  );
};

const TimelineContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  overscroll-behavior: contain;
`;

const TrackContainer = styled.div`
  width: auto;
  min-width: 100%;
  display: inline-block;
  white-space: nowrap;
  position: absolute;
`;

const TrackTitle = styled.div`
  display: inline-block;
  position: sticky;
  left: 0;
  overflow: hidden;
  z-index: 1;
`;

const TrackContent = styled.div`
  display: inline-block;
  position: relative;
  vertical-align: top;
`;

const TrackItem = styled.div`
  position: absolute;
  overflow: hidden;
`;

const TimelineContentWrapper = styled.div`
  position: relative;
  min-width: 100%;
`;
