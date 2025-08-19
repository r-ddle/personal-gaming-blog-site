"use client";

interface ContentRendererProps {
  content: string;
  className?: string;
}

export function ContentRenderer({ content, className = '' }: ContentRendererProps) {
  const formatContent = (text: string) => {
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

  return (
    <div 
      className={`content-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  );
}