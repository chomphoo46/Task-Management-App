import { describe, it, expect, vi, beforeEach, type MockedFunction } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import Register from "../Register";
import API from "../../services/api";

// Mock API
vi.mock("../../services/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Register Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders register form correctly", () => {
    renderWithRouter(<Register />);

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    renderWithRouter(<Register />);

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i)).toHaveLength(4);
    });
  });

  it("shows error for invalid email format", async () => {
    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "invalidemail" } });
    fireEvent.blur(screen.getByPlaceholderText(/email/i));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: "password321" } });
    fireEvent.blur(screen.getByPlaceholderText(/confirm password/i));

    expect(await screen.findByText(/passwords must match/i)).toBeInTheDocument();
  });

  it("successfully registers and navigates to login page", async () => {
    (API.post as MockedFunction<typeof API.post>).mockResolvedValue({});

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: "password123" } });

    fireEvent.submit(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });

  it("shows error message when registration fails", async () => {
    (API.post as MockedFunction<typeof API.post>).mockRejectedValue(new Error("Email already exists"));

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "existing@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: "password123" } });

    fireEvent.submit(screen.getByRole("button", { name: /register/i }));

    expect(await screen.findByText(/email already exists/i)).toBeInTheDocument();
  });
});
