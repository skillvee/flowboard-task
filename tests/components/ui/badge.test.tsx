import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge).toHaveClass("bg-gray-100");
    expect(badge).toHaveClass("text-gray-800");
  });

  it("applies success variant styles", () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText("Success");
    expect(badge).toHaveClass("bg-green-100");
    expect(badge).toHaveClass("text-green-800");
  });

  it("applies warning variant styles", () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText("Warning");
    expect(badge).toHaveClass("bg-yellow-100");
    expect(badge).toHaveClass("text-yellow-800");
  });

  it("applies error variant styles", () => {
    render(<Badge variant="error">Error</Badge>);
    const badge = screen.getByText("Error");
    expect(badge).toHaveClass("bg-red-100");
    expect(badge).toHaveClass("text-red-800");
  });

  it("applies info variant styles", () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText("Info");
    expect(badge).toHaveClass("bg-blue-100");
    expect(badge).toHaveClass("text-blue-800");
  });

  it("accepts custom className", () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText("Custom");
    expect(badge).toHaveClass("custom-class");
  });
});
