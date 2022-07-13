import styled from "styled-components";

export const PanelWrapper = styled.section`
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  padding: 0;
  height: 100%;
  border-top: solid 1px var(--swr-devtools-border-color);
`;

export const PanelItem = styled.div`
  flex: 1;
  overflow: auto;
`;

export const CacheItems = styled.ul`
  margin: 0;
  list-style: none;
  padding-inline-start: 0;
`;

export const CacheItem = styled.li<{ isSelected: boolean }>`
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

export const CacheItemButton = styled.button`
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

export const VerticalDivider = styled.div`
  background-color: var(--swr-devtools-border-color);
  width: 1px;
`;

export const Timestamp = styled.span`
  margin-right: 8px;
`;
