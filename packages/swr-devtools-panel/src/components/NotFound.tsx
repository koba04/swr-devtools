import React from "react";
import styled from "styled-components";

export const NotFound = () => (
  <Wrapper>
    <Text>
      Open SWRDevTools on the page using SWR.
    </Text>
    <Button onClick={onClick}>Connect</Button>
  </Wrapper>
)


const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
`;

const Text = styled.p`
  color: var(--swr-devtools-text-color);
`;

const Button = styled.button`
  display: block;
  font-size: 1.2rem;
  color: var(--swr-devtools-text-color);
  background-color: var(--swr-devtools-bg-color);
  border: solid 1px var(--swr-devtools-border-color);
  padding: 8px;
  border-radius: 4px;

  &:hover {
    background-color: var(--swr-devtools-hover-bg-color);
  }
`

// TODO: extract from swr-devtools-panel
const onClick = () => {
  window.postMessage("connect");
}