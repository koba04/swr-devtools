import React from "react";
import styled from "styled-components";
import { formatDateTime } from "../format";
import { CacheData } from "./CacheData";
import {
  CacheItem,
  CacheItemButton,
  CacheItems,
  PanelItem,
  PanelWrapper,
  Timestamp,
  VerticalDivider,
} from "./Panel";

const TYPE_MAP = {
  success: "✅",
  ongoing: "🏃‍♂️",
  error: "❌",
};

export const HistoryPanel = ({
  tracks,
  selectedItem,
  onSelectedItem,
  modeType
}: {
  tracks: any[];
  selectedItem: any;
  onSelectedItem: (data: any) => void;
  modeType: string
}) => {
  const histories = tracks.flatMap((track) => track.items);
  histories.sort((a, b) => {
    if (a.data.startTime < b.data.startTime) return 1;
    if (a.data.startTime > b.data.startTime) return -1;
    return 0;
  });
  return (
    <PanelWrapper>
      <PanelItem>
        <CacheItems>
          {histories.map((track) => (
            <CacheItem
              key={track.key}
              isSelected={selectedItem && selectedItem.id === track.data.id}
            >
              <CacheItemButton
                onClick={() => {
                  if (
                    track.data.type === "success" ||
                    track.data.type === "error"
                  ) {
                    onSelectedItem({
                      ...track.data,
                      timestamp: track.data.endTime,
                      timestampString: formatDateTime(track.data.endTime),
                    });
                  }
                }}
              >
                <CacheText>
                  <div>{track.data.key}</div>
                  {/* @ts-expect-error */}
                  <Labels>{TYPE_MAP[track.data.type]}</Labels>
                </CacheText>
                <Timestamp>{formatDateTime(track.data.startTime)}</Timestamp>
              </CacheItemButton>
            </CacheItem>
          ))}
        </CacheItems>
      </PanelItem>
      <VerticalDivider />
      <PanelItem>
        {selectedItem && <CacheData cacheData={selectedItem} modeType={modeType} />}
      </PanelItem>
    </PanelWrapper>
  );
};

const CacheText = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin-right: auto;
  flex: 1;
  padding-left: 8px;
  min-height: 2em;
`;

const Labels = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  margin-left: 8px;
  margin-right: 4px;
`;
