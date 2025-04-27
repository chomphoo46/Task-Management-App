import { describe, it, expect, vi, beforeEach, afterEach, type MockedFunction } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import Tasks from "../Tasks";
import API from "../../services/api";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => <div data-testid="toaster" />, // ✅ Mock Toaster เป็น div เปล่า
}));

// Mock API
vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockTasks = [
  { id: "1", title: "Test Task 1", description: "Test Description 1", status: "pending" },
  { id: "2", title: "Test Task 2", description: "Test Description 2", status: "in_progress" },
];

describe("Tasks Page", () => {
  beforeEach(() => {
    (API.get as MockedFunction<typeof API.get>).mockResolvedValue({ data: mockTasks });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders tasks correctly", async () => {
    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    expect(await screen.findByText(/test task 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/test description 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/test task 2/i)).toBeInTheDocument();
  });

  it("adds a new task", async () => {
    (API.post as MockedFunction<typeof API.post>).mockResolvedValue({ data: { id: "3", title: "New Task", description: "", status: "pending" } });

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    fireEvent.change(await screen.findByPlaceholderText(/title/i), { target: { value: "New Task" } });
    fireEvent.submit(screen.getByRole("button", { name: /add task/i }));

    expect(await screen.findByText(/new task/i)).toBeInTheDocument();
  });

  it("edits a task", async () => {
    (API.patch as MockedFunction<typeof API.patch>).mockResolvedValue({ data: { id: "1", title: "Updated Task", description: "Updated Description", status: "pending" } });

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const editButtons = await screen.findAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const input = await screen.findByDisplayValue(/test task 1/i);
    fireEvent.change(input, { target: { value: "Updated Task" } });

    const saveButton = await screen.findByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/updated task/i)).toBeInTheDocument();
    });
  });

  it("deletes a task", async () => {
    window.confirm = vi.fn(() => true);
    (API.delete as MockedFunction<typeof API.delete>).mockResolvedValue({});

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const deleteButtons = await screen.findAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText(/test task 1/i)).not.toBeInTheDocument();
    });
  });

  it("changes task status", async () => {
    (API.patch as MockedFunction<typeof API.patch>).mockResolvedValue({ data: { id: "1", status: "completed" } });

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const select = await screen.findByDisplayValue("Pending");
    fireEvent.change(select, { target: { value: "completed" } });

    expect(await screen.findByDisplayValue(/completed/i)).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    (API.get as MockedFunction<typeof API.get>).mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows no tasks found state", async () => {
    (API.get as MockedFunction<typeof API.get>).mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    expect(await screen.findByText(/no tasks found/i)).toBeInTheDocument();
  });

  it("handles fetchTasks error", async () => {
    (API.get as MockedFunction<typeof API.get>).mockRejectedValue(new Error("fetch error"));

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    expect(await screen.findByText(/no tasks found/i)).toBeInTheDocument();
  });

  it("handles add task error", async () => {
    (API.post as MockedFunction<typeof API.post>).mockRejectedValue(new Error("add error"));

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    fireEvent.change(await screen.findByPlaceholderText(/title/i), { target: { value: "Error Task" } });
    fireEvent.submit(screen.getByRole("button", { name: /add task/i }));

    await waitFor(() => {
      expect(screen.queryByText(/error task/i)).not.toBeInTheDocument();
    });
  });

  it("handles save task error", async () => {
    (API.patch as MockedFunction<typeof API.patch>).mockRejectedValue(new Error("save error"));

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const editButtons = await screen.findAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const input = await screen.findByDisplayValue(/test task 1/i);
    fireEvent.change(input, { target: { value: "Error Save" } });

    const saveButton = await screen.findByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.queryByText(/error save/i)).not.toBeInTheDocument();
    });
  });

  it("handles update status error", async () => {
    (API.patch as MockedFunction<typeof API.patch>).mockRejectedValue(new Error("status error"));

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const select = await screen.findByDisplayValue("Pending");
    fireEvent.change(select, { target: { value: "completed" } });

    await waitFor(() => {
      expect(select).toHaveValue("pending");
    });
  });

  it("handles invalid delete id", async () => {
    window.confirm = vi.fn(() => true);
    (API.delete as MockedFunction<typeof API.delete>).mockRejectedValue(new Error("delete error"));

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const deleteButtons = await screen.findAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/test task 1/i)).toBeInTheDocument();
    });
  });

  it("cancels edit task", async () => {
    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    const editButtons = await screen.findAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const cancelButton = await screen.findByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /save/i })).not.toBeInTheDocument();
    });
  });

  it("renders task with unknown status color", async () => {
    (API.get as MockedFunction<typeof API.get>).mockResolvedValue({
      data: [
        { id: "99", title: "Unknown Task", description: "", status: "unknown" }
      ],
    });

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    expect(await screen.findByText(/unknown task/i)).toBeInTheDocument();
  });

  it("renders task without description", async () => {
    (API.get as MockedFunction<typeof API.get>).mockResolvedValue({
      data: [
        { id: "100", title: "No Description Task", status: "pending" }
      ],
    });

    render(
      <BrowserRouter>
        <Tasks />
      </BrowserRouter>
    );

    expect(await screen.findByText(/no description task/i)).toBeInTheDocument();
    expect(screen.queryByText(/test description/i)).not.toBeInTheDocument();
  });
});
