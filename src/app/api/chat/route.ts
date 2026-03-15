import { anthropic } from "@ai-sdk/anthropic";
import { streamText, tool } from "ai";
import { z } from "zod";
import { generationPrompt } from "@/lib/prompts/generation";

export async function POST(req: Request) {
  const { messages, files } = await req.json();

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system: generationPrompt,
    messages,
    tools: {
      str_replace_editor: tool({
        description:
          "A tool for viewing, creating, and editing files in the virtual file system. Use 'view' to read files, 'create' to make new files, 'str_replace' to edit existing files by replacing text, and 'insert' to add new lines.",
        parameters: z.object({
          command: z
            .enum(["view", "create", "str_replace", "insert"])
            .describe("The command to execute"),
          path: z
            .string()
            .describe(
              "The path to the file, starting with /. Example: /App.jsx"
            ),
          file_text: z
            .string()
            .optional()
            .describe("The content of the file (for create command)"),
          old_str: z
            .string()
            .optional()
            .describe("The text to replace (for str_replace command)"),
          new_str: z
            .string()
            .optional()
            .describe(
              "The new text (for str_replace and insert commands)"
            ),
          insert_line: z
            .number()
            .optional()
            .describe("The line number to insert at (for insert command)"),
          view_range: z
            .array(z.number())
            .optional()
            .describe(
              "The range of lines to view [start, end] (for view command)"
            ),
        }),
        execute: async (args) => {
          // Tool execution happens client-side via onToolCall
          return { success: true, ...args };
        },
      }),
      file_manager: tool({
        description:
          'Rename or delete files or folders in the file system. Rename can be used to "move" a file.',
        parameters: z.object({
          command: z
            .enum(["rename", "delete"])
            .describe("The operation to perform"),
          path: z
            .string()
            .describe("The path to the file or directory to rename or delete"),
          new_path: z
            .string()
            .optional()
            .describe(
              "The new path. Only provide when renaming or moving a file."
            ),
        }),
        execute: async (args) => {
          // Tool execution happens client-side via onToolCall
          return { success: true, ...args };
        },
      }),
    },
    maxSteps: 10,
  });

  return result.toDataStreamResponse();
}
