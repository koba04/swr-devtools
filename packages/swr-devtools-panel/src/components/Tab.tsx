import React from "react";
import styled from "styled-components";
import { PanelType, Panel } from "./SWRDevToolPanel";

type TabProps = {
  onChange: (panel: PanelType) => void;
  current: PanelType;
  panels: Panel[];
};

export const Tab = ({ onChange, current, panels }: TabProps) => (
  <TabGroup>
    {panels.map((panel) => (
      <li key={panel.key}>
        <TabButton
          onClick={() => onChange(panel.key)}
          isSelected={panel.key === current}
        >
          {panel.label}
        </TabButton>
      </li>
    ))}
  </TabGroup>
);

const TabButton = styled.button.attrs({ type: "button" })<{
  isSelected: boolean;
  children: React.ReactNode;
}>`
  display: inline-block;
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0.2rem 1.5rem;
  border-bottom: ${(props) =>
    props.isSelected
      ? "solid 2px var(--swr-devtools-selected-border-color)"
      : "none"};
  background-color: ${(props) =>
    props.isSelected
      ? "var(--swr-devtools-selected-bg-color)"
      : "var(--swr-devtools-bg-color)"};
  color: var(--swr-devtools-text-color);
  cursor: pointer;
  &:hover {
    background-color: ${(props) =>
      props.isSelected
        ? "var(--swr-devtools-selected-bg-color)"
        : "var(--swr-devtools-hover-bg-color)"};
  }
  user-select: none;
`;

const TabGroup = styled.ul`
  display: flex;
  margin: 0;
  list-style: none;
  padding-inline-start: 0;
`;
