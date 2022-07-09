import React, { MouseEvent, useCallback, useState } from "react";
import styled from "styled-components";
import { Cache } from "swr";
import { EventEmitter, RequestsById, useRequests, useTracks } from "../request";
import { CacheData } from "./CacheData";

import { PanelType } from "./SWRDevToolPanel";
import { Timeline } from "./timeline";

function formatTime(time: number, step: number) {
  if (step >= 500) return time / 1000 + "s";
  if (time >= 10000) return time / 1000 + "s";
  return time + "ms";
}

const formatDateTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

export const NetworkPanel = ({
  requestsById,
  tracks,
  startTime,
}: {
  requestsById: RequestsById;
  tracks: any[];
  startTime: number;
}) => {
  const [requestDetail, setRequestDetail] = useState<null | any>(null);

  const [trackScale, setTrackScale] = React.useState(5);
  const [timelineHoverX, setTimelineHoverX] = React.useState(-1);

  const [endTime, trackWidth] = React.useMemo(() => {
    const e = Date.now() + 500;
    return [e, (e - startTime) / (2 * trackScale)];
    // We have to include `requestsById` here just to refresh the
    // timeline whenever there's any udpate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestsById, startTime, trackScale]);

  const onPointerMove = useCallback((e: MouseEvent) => {
    setTimelineHoverX(~~e.nativeEvent.offsetX + 100);
  }, []);

  const onPointerOut = useCallback(() => {
    setTimelineHoverX(-1);
  }, []);

  return (
    <PanelWrapper>
      {requestDetail ? (
        <Detail>
          <CacheData devToolsCacheData={requestDetail} />
          <CloseButtonWrapper>
            <button onClick={() => setRequestDetail(null)}>Close</button>
          </CloseButtonWrapper>
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
                onClick={() =>
                  setRequestDetail({
                    ...item.data,
                    timestamp: item.data.startTime,
                    timestampString: formatDateTime(item.data.startTime),
                  })
                }
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
  background: var(--swr-devtools-network-panel-bg-color);
  z-index: 2;
  height: 70%;
  top: 15%;
  padding: 10px;
  overflow: scroll;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0 3px 10px #0000001a;
  border: 1px solid #0000001a;
  width: 50%;
`;

const CloseButtonWrapper = styled.div`
  text-align: center;
  padding: 10px;
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
