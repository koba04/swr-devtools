import React, { useState } from "react";
import styled from "styled-components";
import { CacheData } from "./CacheData";

const TYPE_MAP = {
  success: "✅",
  ongoing: "🏃‍♂️",
  error: "❌",
};

export const HistoryPanel = ({
  tracks,
  selectedItem,
  onSelectedItem,
}: {
  tracks: any[];
  selectedItem: any;
  onSelectedItem: (data: any) => void;
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
                      timestampString: formatTime(track.data.endTime),
                    });
                  }
                }}
              >
                <CacheText>
                  <div>{track.data.key}</div>
                  {/* @ts-expect-error */}
                  <Labels>{TYPE_MAP[track.data.type]}</Labels>
                </CacheText>
                <Timestamp>{formatTime(track.data.startTime)}</Timestamp>
              </CacheItemButton>
            </CacheItem>
          ))}
        </CacheItems>
      </PanelItem>
      <VerticalDivider />
      <PanelItem>
        {selectedItem && <CacheData devToolsCacheData={selectedItem} />}
      </PanelItem>
    </PanelWrapper>
  );
};

const formatTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

const PanelWrapper = styled.section`
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  padding: 0;
  height: 100%;
  border-top: solid 1px var(--swr-devtools-border-color);
`;

const PanelItem = styled.div`
  flex: 1;
  overflow: auto;
`;

const CacheItems = styled.ul`
  margin: 0;
  list-style: none;
  padding-inline-start: 0;
`;

const CacheItem = styled.li<{ isSelected: boolean }>`
  padding: 0;
  border-bottom: solid 1px var(--swr-devtools-border-color);
  background-color: ${(props) =>
    props.isSelected ? "var(--swr-devtools-selected-bg-color)" : "none"};
  &:hover {
    background-color: ${(props) =>
      props.isSelected
        ? "var(--swr-devtools-selected-bg-color)"
        : "var(--swr-devtools-hover-bg-color)"};
  }
`;

const VerticalDivider = styled.div`
  background-color: var(--swr-devtools-border-color);
  width: 1px;
`;

const CacheText = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin-right: auto;
  flex: 1;
  padding-left: 8px;
  min-height: 2em;
`;

const CacheItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: 2px;
  width: 100%;
  height: 100%;
  padding: 0.2rem 0;
  border: none;
  background: transparent;
  color: var(--swr-devtools-text-color);
  cursor: pointer;
  text-align: left;
`;

const Timestamp = styled.span`
  margin-right: 8px;
`;

const Labels = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  margin-left: 8px;
  margin-right: 4px;
`;
