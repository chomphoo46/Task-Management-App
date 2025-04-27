import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import Logout from "../Logout";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Logout Component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("user", JSON.stringify({ name: "Test User" }));
  });

  it("clears localStorage and redirects to login", async () => {
    renderWithRouter(<Logout />);

    await waitFor(() => {
      // localStorage ต้องถูกล้าง
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();

      // ต้องแสดงข้อความ Logging out...
      expect(screen.getByText(/logging out/i)).toBeInTheDocument();

      // และต้อง redirect ไปหน้า /
      expect(window.location.pathname).toBe("/");
    });
  });
});
