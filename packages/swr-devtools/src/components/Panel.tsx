import React, { useState } from "react";
import styled from "styled-components";

import { SWRCacheData } from "../cache";
import { PanelType, ItemKey } from "./SWRDevTool";
import { CacheData } from "./CacheData";

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
          {cacheData.map(({ id, key, timestampString, timestamp }) => (
            <CacheItem
              key={id}
              isSelected={
                selectedItemKey?.key === key &&
                (type === "current" || selectedItemKey?.timestamp === timestamp)
              }
            >
              <CacheItemButton onClick={() => onSelectItem({ key, timestamp })}>
                {key} ({timestampString})
              </CacheItemButton>
            </CacheItem>
          ))}
        </CacheItems>
      </PanelItem>
      <hr />
      <PanelItem>
        {currentData && (
          <>
            <PanelDataTitle>
              {currentData.key}&nbsp;
              <span style={{ fontSize: "1rem", fontWeight: "normal" }}>
                {currentData.timestampString}
              </span>
            </PanelDataTitle>
            <CacheData data={currentData} />
          </>
        )}
      </PanelItem>
    </PanelWrapper>
  );
};

const PanelWrapper = styled.section`
  display: flex;
  justify-content: space-around;
  padding: 0;
  height: 100%;
  border-top: solid 1px #ccc;
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
  padding: 0.3rem 0;
  border-bottom: solid 1px #ddd;
  background-color: ${(props) => (props.isSelected ? "#e6e0dd" : "none")};
  &:hover {
    background-color: #f7f5f4;
  }
`;

const CacheItemButton = styled.button`
  display: inline-block;
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
`;

const PanelDataTitle = styled.h3`
  margin: 0;
  padding: 1rem 0.5rem;
`;
