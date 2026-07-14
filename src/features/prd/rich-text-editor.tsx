"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

function textToHtml(text: string) {
  return text
    .split("\n")
    .map(
      (line) =>
        `<p>${line.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;") || "<br>"}</p>`
    )
    .join("");
}

export function RichTextEditor({
  value,
  onChange,
  onSave
}: {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: textToHtml(value),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[520px] rounded-lg border bg-background px-5 py-4 text-sm leading-7 outline-none focus:ring-2 focus:ring-ring"
      }
    },
    onUpdate({ editor: activeEditor }) {
      onChange(activeEditor.getText({ blockSeparator: "\n" }));
    }
  });

  useEffect(() => {
    if (editor && editor.getText({ blockSeparator: "\n" }) !== value) {
      editor.commands.setContent(textToHtml(value), false);
    }
  }, [editor, value]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border bg-card p-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Bullet list"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Numbered list"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" aria-hidden="true" />
        </Button>
        <div className="ml-auto">
          <Button type="button" size="sm" onClick={onSave}>
            <Save className="h-4 w-4" aria-hidden="true" />
            Save
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
