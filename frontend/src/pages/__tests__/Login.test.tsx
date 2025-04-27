import { describe, it, expect, vi, beforeEach, type MockedFunction } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import '@testing-library/jest-dom';

// 🛠 Mock useNavigate ก่อน import Login
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// 🛠 Mock jwtDecode ก่อน import Login
vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(() => ({
    sub: "userId",
    email: "test@example.com",
    name: "Test User",
    iat: 0,
    exp: 999999,
  })),
}));

import Login from "../Login"; // 👈 import หลัง mock
import API from "../../services/api";

// 🛠 Mock API
vi.mock("../../services/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockedNavigate = vi.mocked(useNavigate);

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form correctly", () => {
    renderWithRouter(<Login />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome to taskmanagement/i)).toBeInTheDocument();
  });

  it("shows validation error when email is invalid", async () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "invalidemail" } });
    fireEvent.blur(screen.getByPlaceholderText(/email/i));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it("shows validation error when password is too short", async () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "123" } });
    fireEvent.blur(screen.getByPlaceholderText(/password/i));

    expect(await screen.findByText(/min 6 chars/i)).toBeInTheDocument();
  });

  it("shows required field errors when fields are empty", async () => {
    renderWithRouter(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i)).toHaveLength(2);
    });
  });

  it("successfully logs in and navigates to dashboard", async () => {
    (API.post as MockedFunction<typeof API.post>).mockResolvedValue({
      data: {
        token: "mocked.jwt.token",
      },
    });

    const navigate = vi.fn();
    mockedNavigate.mockReturnValue(navigate);

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });

    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/dashboard");
    });

    // ✅ Bonus: ตรวจว่า localStorage ได้เก็บ token ด้วย
    expect(localStorage.getItem("token")).toBe("mocked.jwt.token");
    expect(JSON.parse(localStorage.getItem("user")!)).toEqual({ name: "Test User" });
  });

  it("shows error when API login fails", async () => {
    (API.post as MockedFunction<typeof API.post>).mockRejectedValue(new Error("Invalid email or password"));

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "wrongpass" } });

    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });
});
