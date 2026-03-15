"use client";

import { ToolInvocation } from "ai";
import { Loader2, Check } from "lucide-react";

interface StrReplaceEditorArgs {
  command: "view" | "create" | "str_replace" | "insert";
  path: string;
}

interface FileManagerArgs {
  command: "rename" | "delete";
  path: string;
  new_path?: string;
}

function getToolMessage(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;

  if (toolName === "str_replace_editor" && args) {
    const { command, path } = args as StrReplaceEditorArgs;
    if (!path) return toolName;

    switch (command) {
      case "create":
        return `Creating ${path}`;
      case "str_replace":
      case "insert":
        return `Editing ${path}`;
      case "view":
        return `Viewing ${path}`;
      default:
        return `Working on ${path}`;
    }
  }

  if (toolName === "file_manager" && args) {
    const { command, path, new_path } = args as FileManagerArgs;
    if (!path) return toolName;

    if (command === "rename" && new_path) {
      return `Renaming ${path} → ${new_path}`;
    }
    if (command === "delete") {
      return `Deleting ${path}`;
    }
  }

  return toolName;
}

interface ToolInvocationIndicatorProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationIndicator({ toolInvocation }: ToolInvocationIndicatorProps) {
  const message = getToolMessage(toolInvocation);
  const isComplete = toolInvocation.state === "result" && toolInvocation.result !== undefined;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <>
          <Check className="w-3 h-3 text-emerald-500" />
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
