import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import '@testing-library/jest-dom';
import DashboardLayout from "../../components/DashboardLayout";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("DashboardLayout Component", () => {
  it("renders sidebar navigation items correctly", () => {
    renderWithRouter(
      <DashboardLayout>
        <div>Mock Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it("renders children content correctly", () => {
    renderWithRouter(
      <DashboardLayout>
        <div>Mock Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText(/mock content/i)).toBeInTheDocument();
  });

  it("highlights active link when location matches path", () => {
    const history = createMemoryHistory();
    history.push("/dashboard");

    render(
      <Router location={history.location} navigator={history}>
        <DashboardLayout>
          <div>Mock Content</div>
        </DashboardLayout>
      </Router>
    );

    const activeLink = screen.getByText(/dashboard/i);
    expect(activeLink).toHaveClass("bg-purple-100");
    expect(activeLink).toHaveClass("text-purple-700");
    expect(activeLink).toHaveClass("font-medium");
  });
});
