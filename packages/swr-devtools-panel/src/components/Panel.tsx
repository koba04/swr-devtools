import React from "react";
import styled from "styled-components";

import { SWRCacheData } from "swr-devtools/lib/swr-cache";
import { PanelType, ItemKey } from "./SWRDevToolPanel";
import { CacheData } from "./CacheData";
import { CacheKey } from "./CacheKey";

export const Panel = ({
  data: cacheData,
  type,
  selectedItemKey,
  onSelectItem,
}: {
  data: SWRCacheData[];
  type: PanelType;
  selectedItemKey: ItemKey | null;
  onSelectItem: (itemKey: ItemKey) => void;
}) => {
  const currentData =
    selectedItemKey &&
    cacheData.find(
      (c) =>
        c.key === selectedItemKey.key &&
        (type === "current" || c.timestamp === selectedItemKey.timestamp)
    );
  return (
    <PanelWrapper>
      <PanelItem>
        <CacheItems>
          {cacheData.map(({ key, timestampString, timestamp }) => (
            <CacheItem
              key={`${type}--${key}--${
                type === "history" ? timestamp.getTime() : ""
              }`}
              isSelected={
                selectedItemKey?.key === key &&
                (type === "current" || selectedItemKey?.timestamp === timestamp)
              }
            >
              <CacheItemButton onClick={() => onSelectItem({ key, timestamp })}>
                <CacheKey cacheKey={key} /> ({timestampString})
              </CacheItemButton>
            </CacheItem>
          ))}
        </CacheItems>
      </PanelItem>
      <Hr />
      <PanelItem>{currentData && <CacheData data={currentData} />}</PanelItem>
    </PanelWrapper>
  );
};

const PanelWrapper = styled.section`
  display: flex;
  justify-content: space-around;
  padding: 0;
  height: 100%;
  border-top: solid 1px var(--swr-devtools-border-color);
`;

const PanelItem = styled.div`
  flex: 1;
  overflow: scroll;
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

const CacheItemButton = styled.button`
  display: inline-block;
  width: 100%;
  height: 100%;
  padding: 0.5rem 0;
  border: none;
  background: transparent;
  color: var(--swr-devtools-text-color);
  cursor: pointer;
  text-align: left;
`;

const Hr = styled.hr`
  border-color: var(--swr-devtools-border-color);
`;