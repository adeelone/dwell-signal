import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("DwellSignal", () => {
  beforeEach(() => localStorage.clear());
  it("shows the owner portfolio and shared requests", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Portfolio" })).toBeInTheDocument();
    expect(screen.getByText("Open maintenance requests")).toBeInTheDocument();
  });
  it("switches to the technician portal", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: "technician" })[0]);
    expect(screen.getByRole("heading", { name: /workbench/i })).toBeInTheDocument();
    expect(screen.getByText("Qualified job queue")).toBeInTheDocument();
  });
  it("classifies a resident request as they type", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: "resident" })[0]);
    await user.type(screen.getByLabelText("What needs attention?"), "The kitchen faucet is leaking under the handle.");
    expect(screen.getByText("Plumbing")).toBeInTheDocument();
    expect(screen.getByText(/manager can correct this/i)).toBeInTheDocument();
  });
});
