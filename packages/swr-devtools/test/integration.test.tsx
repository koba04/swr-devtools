import React from "react";
import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";
import { createSWRDevtools } from "../src";
import useSWR, { SWRConfig } from "swr";

expect.extend(matchers);
vi.stubGlobal("matchMedia", () => ({
  matches: false,
}));

const App = () => {
  const { data, isLoading } = useSWR("/api", async () => "response");
  if (isLoading) return <div>loading</div>;
  return <div>data:{data}</div>;
};

describe("SWRDevToolPanel", () => {
  it("should be able to use SWR inside the tree", async () => {
    const [middleware, _eventEmitter] = createSWRDevtools();
    render(
      <SWRConfig value={{ use: [middleware] }}>
        <App />
      </SWRConfig>
    );
    expect(await screen.findByText("data:response")).toBeInTheDocument();
  });
});
