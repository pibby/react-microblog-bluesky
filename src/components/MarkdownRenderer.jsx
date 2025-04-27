import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Function to extract YouTube Video ID from URL
const getYouTubeId = (url) => {
  // Updated Regex to handle various YouTube URL formats
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const MarkdownRenderer = ({ markdownText }) => {
  const components = {
    // Syntax Highlighting for code blocks
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={coy}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        // Inline code
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    // Custom renderer for paragraphs to detect YouTube links
    p: ({ node, children }) => {
      // Check if paragraph's only child is a text node containing a potential YouTube URL
      if (
        node.children.length === 1 &&
        node.children[0].type === 'text' &&
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(node.children[0].value)
      ) {
        const videoId = getYouTubeId(node.children[0].value);
        if (videoId) {
          return (
            <div className="youtube-embed">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          );
        }
      }
      // Otherwise, render a normal paragraph
      return <p>{children}</p>;
    },
    img: ({ node, ...props }) => (
        <img className="markdown-image" {...props} alt={props.alt || ''} loading="lazy" />
    ),
    a: ({ node, href, ...props }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ),
  };

  return (
    <div className="markdown-content">
        <ReactMarkdown components={components}>
            {markdownText}
        </ReactMarkdown>
    </div>
   )
};

export default MarkdownRenderer;