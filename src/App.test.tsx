import { render, screen, within } from "@testing-library/react";
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
    await user.type(
      screen.getByLabelText("What needs attention?"),
      "The kitchen faucet is leaking under the handle.",
    );
    expect(screen.getByText("Plumbing")).toBeInTheDocument();
    expect(screen.getByText(/manager can correct this/i)).toBeInTheDocument();
  });
  it("records a demo payment without moving money", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "resident" }));
    await user.click(screen.getByRole("button", { name: "Record demo payment" }));
    expect(screen.getByText("$0.00")).toBeInTheDocument();
    expect(screen.getByText(/No money moved/i)).toBeInTheDocument();
  });
  it("lets an owner reassign a request to a qualified technician", async () => {
    const user = userEvent.setup();
    render(<App />);
    const assignment = screen.getByLabelText("Assign request 12548");
    await user.selectOptions(assignment, "");
    const requestRow = screen.getByRole("row", { name: /#12548/ });
    await user.click(within(requestRow).getByRole("button", { name: "Best match" }));
    expect(assignment).toHaveValue("Marcus Hill");
  });
  it("lets an owner schedule work inside a resident access window", async () => {
    const user = userEvent.setup();
    render(<App />);
    const schedule = screen.getByLabelText("Schedule request 12547");
    await user.selectOptions(schedule, "Fri 2–6");
    expect(schedule).toHaveValue("Fri 2–6");
  });
  it("opens the supporting owner screens and alert dialog", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Alerts\s*4/ }));
    expect(screen.getByRole("heading", { name: "Alerts" })).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Review" })[0]);
    expect(screen.getByRole("dialog", { name: /5th Floor/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    await user.click(screen.getByRole("button", { name: "Reports" }));
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getByRole("button", { name: "Reset demo" })).toBeInTheDocument();
  });
});
