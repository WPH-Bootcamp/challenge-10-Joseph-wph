"use client";

import { useRef, useEffect } from "react";
import DOMPurify from "dompurify";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

// Sanitize HTML to remove dangerous tags and attributes
export function sanitizeHtml(html: string): string {
    if (typeof window === "undefined") return html;

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "ul", "ol", "li",
            "blockquote", "pre", "code",
            "a", "img",
            "table", "thead", "tbody", "tr", "th", "td",
            "div", "span"
        ],
        ALLOWED_ATTR: [
            "href", "src", "alt", "title", "class", "style",
            "target", "rel"
        ],
        FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input"],
        FORBID_ATTR: [
            "onclick", "onerror", "onload", "onmouseover", "onmouseout",
            "onfocus", "onblur", "onchange", "onsubmit"
        ],
    });
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "Enter your content",
    disabled = false,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const isUpdating = useRef(false);

    useEffect(() => {
        if (editorRef.current && !isUpdating.current) {
            const sanitized = sanitizeHtml(value);
            if (editorRef.current.innerHTML !== sanitized) {
                editorRef.current.innerHTML = sanitized;
            }
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            isUpdating.current = true;
            const html = editorRef.current.innerHTML;
            const sanitized = sanitizeHtml(html);
            onChange(sanitized);
            setTimeout(() => {
                isUpdating.current = false;
            }, 0);
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        handleInput();
    };

    return (
        <div className="rich-text-editor border rounded-lg overflow-hidden">
            <div className="toolbar border-b bg-muted/30 p-2 flex flex-wrap gap-1">
                <button
                    type="button"
                    onClick={() => execCommand("bold")}
                    className="p-2 hover:bg-accent rounded"
                    disabled={disabled}
                    title="Bold"
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("italic")}
                    className="p-2 hover:bg-accent rounded"
                    disabled={disabled}
                    title="Italic"
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("underline")}
                    className="p-2 hover:bg-accent rounded"
                    disabled={disabled}
                    title="Underline"
                >
                    <u>U</u>
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("strikeThrough")}
                    className="p-2 hover:bg-accent rounded"
                    disabled={disabled}
                    title="Strikethrough"
                >
                    <s>S</s>
                </button>
                <div className="w-px h-8 bg-border mx-1" />
                <button
                    type="button"
                    onClick={() => execCommand("formatBlock", "<h1>")}
                    className="p-2 hover:bg-accent rounded text-sm"
                    disabled={disabled}
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("formatBlock", "<h2>")}
                    className="p-2 hover:bg-accent rounded text-sm"
                    disabled={disabled}
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("formatBlock", "<h3>")}
                    className="p-2 hover:bg-accent rounded text-sm"
                    disabled={disabled}
                    title="Heading 3"
                >
                    H3
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("formatBlock", "<p>")}
                    className="p-2 hover:bg-accent rounded text-sm"
                    disabled={disabled}
                    title="Paragraph"
                >
                    P
                </button>
                <div className="w-px h-8 bg-border mx-1" />
                <button
                    type="button"
                    onClick={() => execCommand("insertUnorderedList")}
                    className="p-2 hover:bg-accent rounded"
                    disabled={disabled}
                    title="Bullet List"
                >
                    •
                </button>
                <button
                    type="button"
                    onClick={() => execCommand("insertOrderedList")}
                    className="p-2 hover:bg-accent rounded"
                    disabled={disabled}
                    title="Numbered List"
                >
                    1.
                </button>
                <div className="w-px h-8 bg-border mx-1" />
                <button
                    type="button"
                    onClick={() => {
                        const url = prompt("Enter URL:");
                        if (url) execCommand("createLink", url);
                    }}
                    className="p-2 hover:bg-accent rounded"
                    disabled={disabled}
                    title="Insert Link"
                >
                    🔗
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable={!disabled}
                onInput={handleInput}
                className="editor-content p-4 min-h-75 max-h-125 overflow-y-auto focus:outline-none"
                suppressContentEditableWarning
                data-placeholder={placeholder}
            />
            <style jsx>{`
                .editor-content:empty:before {
                    content: attr(data-placeholder);
                    color: hsl(var(--muted-foreground));
                    pointer-events: none;
                }
                .editor-content {
                    font-size: 16px;
                    line-height: 1.6;
                }
                .editor-content h1 {
                    font-size: 2em;
                    font-weight: bold;
                    margin: 0.67em 0;
                }
                .editor-content h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 0.75em 0;
                }
                .editor-content h3 {
                    font-size: 1.17em;
                    font-weight: bold;
                    margin: 0.83em 0;
                }
                .editor-content p {
                    margin: 1em 0;
                }
                .editor-content ul, .editor-content ol {
                    margin: 1em 0;
                    padding-left: 2em;
                }
                .editor-content a {
                    color: hsl(var(--primary));
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
