import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationIndicator } from "../ToolInvocationIndicator";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

test("displays 'Creating' message for str_replace_editor create command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "call",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});

test("displays 'Editing' message for str_replace_editor str_replace command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-2",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "/components/Button.tsx" },
    state: "call",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing /components/Button.tsx")).toBeDefined();
});

test("displays 'Editing' message for str_replace_editor insert command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-3",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "/utils.js" },
    state: "call",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing /utils.js")).toBeDefined();
});

test("displays 'Viewing' message for str_replace_editor view command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-4",
    toolName: "str_replace_editor",
    args: { command: "view", path: "/index.js" },
    state: "call",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Viewing /index.js")).toBeDefined();
});

test("displays 'Renaming' message for file_manager rename command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-5",
    toolName: "file_manager",
    args: { command: "rename", path: "/old.js", new_path: "/new.js" },
    state: "call",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Renaming /old.js → /new.js")).toBeDefined();
});

test("displays 'Deleting' message for file_manager delete command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-6",
    toolName: "file_manager",
    args: { command: "delete", path: "/temp.js" },
    state: "call",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Deleting /temp.js")).toBeDefined();
});

test("shows spinner for 'call' state", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-7",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "call",
  };

  const { container } = render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
  expect(spinner).not.toBeNull();
});

test("shows spinner for 'partial-call' state", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-8",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "partial-call",
  };

  const { container } = render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
  expect(spinner).not.toBeNull();
});

test("shows check icon for 'result' state with result present", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-9",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "File created successfully",
  };

  const { container } = render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  // Check icon should be present (no spinner)
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeNull();

  // Check for the emerald-colored check icon
  const checkIcon = container.querySelector(".text-emerald-500");
  expect(checkIcon).not.toBeNull();
});

test("falls back to tool name for unknown tools", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-10",
    toolName: "unknown_tool",
    args: { some: "args" },
    state: "call",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("handles missing args gracefully", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-11",
    toolName: "str_replace_editor",
    args: {},
    state: "call",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  // Should fall back to tool name when path is missing
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("handles missing path gracefully", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-12",
    toolName: "str_replace_editor",
    args: { command: "create" },
    state: "call",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  // Should fall back to tool name when path is missing
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("displays 'Working on' for unknown str_replace_editor command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "test-13",
    toolName: "str_replace_editor",
    args: { command: "unknown_command", path: "/file.js" },
    state: "call",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("Working on /file.js")).toBeDefined();
});
