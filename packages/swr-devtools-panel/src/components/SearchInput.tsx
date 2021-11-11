import React from "react";
import styled from "styled-components";
import { SearchIcon } from "./icons/SearchIcon";

type Props = {
  onChange: (value: string) => void;
  value: string;
};

export const SearchInput = (props: Props) => (
  <SearchArea>
    <SearchIcon />
    <Input
      type="text"
      value={props.value}
      onChange={(e) => props.onChange(e.currentTarget.value)}
      aria-label="Search"
      placeholder="Input a search query"
    />
  </SearchArea>
);

const SearchArea = styled.label`
  top: 0;
  position: sticky;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 2rem;
  margin: 0;
  padding: 0;
  border-bottom: solid 1px var(--swr-devtools-border-color);
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  background-color: var(--swr-devtools-bg-color);
  border: solid 1px var(--swr-devtools-border-color);
  border: 0;
  margin: 0;
  padding: 0;
  color: var(--swr-devtools-text-color);
`;
