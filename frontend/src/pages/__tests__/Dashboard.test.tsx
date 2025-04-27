import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Dashboard from "../Dashboard";
import API from "../../services/api";

// Mock ResponsiveContainer ของ Recharts
vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

// Mock API
vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockTasks = [
  { id: "1", title: "Task 1", description: "Desc 1", status: "pending" },
  { id: "2", title: "Task 2", description: "Desc 2", status: "in_progress" },
  { id: "3", title: "Task 3", description: "Desc 3", status: "completed" },
];

describe("Dashboard Page", () => {
  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify({ name: "Test User" }));
    (API.get as MockedFunction<typeof API.get>).mockResolvedValue({
      data: mockTasks,
    });
  });

  it("renders greeting with username", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText(/hello, test user/i)).toBeInTheDocument();
  });

  it("renders summary boxes with correct counts", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText(/pending tasks/i)).toBeInTheDocument();
    expect(await screen.findByText(/in progress tasks/i)).toBeInTheDocument();
    expect(await screen.findByText(/completed tasks/i)).toBeInTheDocument();

    const counts = await screen.findAllByText("1");
    expect(counts.length).toBeGreaterThanOrEqual(3);
  });

  it("renders task cards correctly including descriptions", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText(/task 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/task 2/i)).toBeInTheDocument();
    expect(await screen.findByText(/task 3/i)).toBeInTheDocument();

    expect(await screen.findByText(/desc 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/desc 2/i)).toBeInTheDocument();
    expect(await screen.findByText(/desc 3/i)).toBeInTheDocument();
  });

  it("renders pie chart title", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText(/task activity/i)).toBeInTheDocument();
  });

  it("handles corrupted user data gracefully", async () => {
    localStorage.setItem("user", "invalid-json");

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText(/hello, guest/i)).toBeInTheDocument();
  });
  it("handles missing user data gracefully", async () => {
    localStorage.removeItem("user");

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText(/hello, guest/i)).toBeInTheDocument();
  });
});
