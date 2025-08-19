"use client";

import { useState } from "react";
import { IconBold, IconItalic, IconList, IconCode, IconQuote, IconEye, IconEyeOff } from "@tabler/icons-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

export function RichTextEditor({ value, onChange, placeholder, minRows = 8 }: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('.rich-text-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatMarkdown = (text: string) => {
    // Split text into lines for proper list handling
    const lines = text.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isListItem = line.trim().startsWith('- ');
      
      if (isListItem && !inList) {
        processedLines.push('<ul>');
        inList = true;
      } else if (!isListItem && inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      
      if (isListItem) {
        const listContent = line.replace(/^- /, '');
        processedLines.push(`<li>${listContent}</li>`);
      } else if (line.trim().startsWith('> ')) {
        const quoteContent = line.replace(/^> /, '');
        processedLines.push(`<blockquote>${quoteContent}</blockquote>`);
      } else {
        processedLines.push(line);
      }
    }
    
    // Close any open list
    if (inList) {
      processedLines.push('</ul>');
    }
    
    return processedLines.join('<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/<br><ul>/g, '<ul>')
      .replace(/<\/ul><br>/g, '</ul>')
      .replace(/<br><blockquote>/g, '<blockquote>')
      .replace(/<\/blockquote><br>/g, '</blockquote>');
  };

  const toolbarButtons = [
    { icon: IconBold, title: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: IconItalic, title: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: IconCode, title: 'Code', action: () => insertMarkdown('`', '`') },
    { icon: IconQuote, title: 'Quote', action: () => insertMarkdown('> ') },
    { icon: IconList, title: 'List', action: () => insertMarkdown('- ') },
  ];

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <div className="toolbar-section">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              className="toolbar-button"
              title={button.title}
              onClick={button.action}
            >
              <button.icon size={16} />
            </button>
          ))}
        </div>
        <div className="toolbar-section">
          <button
            type="button"
            className={`toolbar-button ${showPreview ? 'active' : ''}`}
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          </button>
        </div>
      </div>

      <div className="editor-content">
        {!showPreview ? (
          <textarea
            className="rich-text-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={minRows}
          />
        ) : (
          <div
            className="editor-preview"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(value) }}
          />
        )}
      </div>

      <div className="editor-help">
        <small>
          Use **bold**, *italic*, `code`, {'>'} quote, - list items
        </small>
      </div>
    </div>
  );
}
