"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { cn } from "@/lib/utils";
import {
    Bold, Italic, Underline as UnderlineIcon, List,
    ListOrdered, Link as LinkIcon, Quote, Redo, Undo
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

import type { Editor } from "@tiptap/core";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-200 bg-zinc-50/50">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={cn(
                    "p-2 rounded hover:bg-zinc-200 transition-colors",
                    editor.isActive("bold") && "bg-zinc-200 text-orange-600"
                )}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn(
                    "p-2 rounded hover:bg-zinc-200 transition-colors",
                    editor.isActive("italic") && "bg-zinc-200 text-orange-600"
                )}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={cn(
                    "p-2 rounded hover:bg-zinc-200 transition-colors",
                    editor.isActive("underline") && "bg-zinc-200 text-orange-600"
                )}
                title="Underline"
            >
                <UnderlineIcon className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-zinc-200 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                    "p-2 rounded hover:bg-zinc-200 transition-colors",
                    editor.isActive("bulletList") && "bg-zinc-200 text-orange-600"
                )}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(
                    "p-2 rounded hover:bg-zinc-200 transition-colors",
                    editor.isActive("orderedList") && "bg-zinc-200 text-orange-600"
                )}
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn(
                    "p-2 rounded hover:bg-zinc-200 transition-colors",
                    editor.isActive("blockquote") && "bg-zinc-200 text-orange-600"
                )}
                title="Blockquote"
            >
                <Quote className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-zinc-200 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-zinc-200 transition-colors"
                title="Undo"
            >
                <Undo className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-zinc-200 transition-colors"
                title="Redo"
            >
                <Redo className="h-4 w-4" />
            </button>
        </div>
    );
};

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-orange-600 underline cursor-pointer',
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-zinc max-w-none focus:outline-none min-h-[200px] p-4 text-sm leading-relaxed",
                    className
                ),
            },
        },
    });

    return (
        <div className="w-full rounded-lg border border-zinc-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-400 transition-all">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
