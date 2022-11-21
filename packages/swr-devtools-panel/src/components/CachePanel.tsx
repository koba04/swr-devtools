import React, { useState } from "react";

import { CacheData } from "./CacheData";
import { CacheKey } from "./CacheKey";
import { SearchInput } from "./SearchInput";
import { DevToolsCacheData } from "swr-devtools/lib/swr-cache";
import {
  CacheItem,
  CacheItemButton,
  CacheItems,
  PanelItem,
  PanelWrapper,
  Timestamp,
  VerticalDivider,
} from "./Panel";

export const CachePanel = ({
  cacheData,
  selectedItem,
  onSelectItem,
  modeType
}: {
  cacheData: DevToolsCacheData[];
  selectedItem: DevToolsCacheData | null;
  onSelectItem: (devToolsCacheData: DevToolsCacheData) => void;
  modeType: string
}) => {
  const [filterText, setFilterText] = useState("");
  const selectedCacheData =
    selectedItem && cacheData.find((c) => c.key === selectedItem.key);
  return (
    <PanelWrapper>
      <PanelItem>
        <SearchInput
          value={filterText}
          onChange={(text: string) => setFilterText(text)}
        />
        <CacheItems>
          {cacheData
            .filter(({ key }) => filterText === "" || key.includes(filterText))
            .map((cacheItem) => (
              <CacheItem
                key={cacheItem.key}
                isSelected={selectedItem?.key === cacheItem.key}
              >
                <CacheItemButton onClick={() => onSelectItem(cacheItem)}>
                  <CacheKey cacheData={cacheItem} />
                  <Timestamp>{cacheItem.timestampString}</Timestamp>
                </CacheItemButton>
              </CacheItem>
            ))}
        </CacheItems>
      </PanelItem>
      <VerticalDivider />
      <PanelItem>
        {selectedCacheData && <CacheData cacheData={selectedCacheData} modeType={modeType} />}
      </PanelItem>
    </PanelWrapper>
  );
};
