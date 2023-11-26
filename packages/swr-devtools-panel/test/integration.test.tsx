import matchers from "@testing-library/jest-dom/matchers";
import { render, screen } from "@testing-library/react";
import React from "react";
import { EventEmitter } from "swr-devtools/lib/createSWRDevTools";
import { describe, expect, it, vi } from "vitest";
import { SWRDevToolPanel } from "../src";

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
