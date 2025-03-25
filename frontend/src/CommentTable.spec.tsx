import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import { CommentTable } from "./CommentTable";

describe("CommentTable", () => {
  const mockData = [
    { name: "Alice", comment: "Hello" },
    { name: "Bob", comment: "Hi" },
  ];

  const handlePageChange = vi.fn();

  it("renders table headers based on data keys", () => {
    render(
      <CommentTable
        totalPages={2}
        page={1}
        handlePageChange={handlePageChange}
        paginatedData={mockData}
      />
    );

    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("comment")).toBeInTheDocument();
  });

  it("renders table rows with correct values", () => {
    render(
      <CommentTable
        totalPages={2}
        page={1}
        handlePageChange={handlePageChange}
        paginatedData={mockData}
      />
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Hi")).toBeInTheDocument();
  });
});
