import React from "react";
import styled from "styled-components";
import { SearchIcon } from "./icons/SearchIcon";

type Props = {
  onChange: (value: string) => void;
  value: string;
};

export const SearchInput = (props: Props) => (
  <SearchArea>
    <Input
      type="text"
      value={props.value}
      onChange={(e) => props.onChange(e.currentTarget.value)}
      aria-label="Search"
      placeholder="Search keys"
    />
    <SearchIcon />
  </SearchArea>
);

const SearchArea = styled.label`
  top: 0;
  position: sticky;
  width: 100%;
  display: flex;
  align-items: center;
  height: 2rem;
  margin: 0;
  padding: 0;
  border-bottom: solid 1px var(--swr-devtools-border-color);
  background-color: var(--swr-devtools-bg-color);
  &:focus-within,
  &:hover {
    background-color: var(--swr-devtools-hover-bg-color);
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: solid 1px var(--swr-devtools-border-color);
  background: none;
  border: 0;
  margin: 0;
  padding: 0;
  padding-left: 8px;
  color: var(--swr-devtools-text-color);
  outline: none;
`;
