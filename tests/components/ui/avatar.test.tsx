import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("displays initials when no src provided", () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("displays image when src provided", () => {
    render(<Avatar name="John Doe" src="https://example.com/avatar.jpg" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(img).toHaveAttribute("alt", "John Doe");
  });

  it("applies xs size", () => {
    render(<Avatar name="John Doe" size="xs" />);
    const avatar = screen.getByText("JD");
    expect(avatar).toHaveClass("w-6", "h-6");
  });

  it("applies sm size", () => {
    render(<Avatar name="John Doe" size="sm" />);
    const avatar = screen.getByText("JD");
    expect(avatar).toHaveClass("w-8", "h-8");
  });

  it("applies md size by default", () => {
    render(<Avatar name="John Doe" />);
    const avatar = screen.getByText("JD");
    expect(avatar).toHaveClass("w-10", "h-10");
  });

  it("applies lg size", () => {
    render(<Avatar name="John Doe" size="lg" />);
    const avatar = screen.getByText("JD");
    expect(avatar).toHaveClass("w-12", "h-12");
  });

  it("handles single name", () => {
    render(<Avatar name="John" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("handles multiple names", () => {
    render(<Avatar name="John Michael Doe" />);
    // Takes first two initials only
    expect(screen.getByText("JM")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    render(<Avatar name="John Doe" className="custom-class" />);
    const avatar = screen.getByText("JD");
    expect(avatar).toHaveClass("custom-class");
  });
});
