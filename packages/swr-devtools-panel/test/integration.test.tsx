import React from "react";
import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";
import { SWRDevToolPanel } from "../src";
import { EventEmitter } from "swr-devtools/lib/createSWRDevTools";

expect.extend(matchers);
vi.stubGlobal("matchMedia", () => ({
  matches: false,
}));

describe("SWRDevToolPanel", () => {
  it("should be able to render SWRDevToolPanel", () => {
    render(<SWRDevToolPanel cache={new Map()} events={new EventEmitter()} />);
    expect(screen.getByRole("heading")).toHaveTextContent("SWR");
  });
});
