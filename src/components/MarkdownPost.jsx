import React from 'react';
import MarkdownRenderer from './MarkdownRenderer'; // Renders the actual markdown

const MarkdownPost = ({ post }) => {
  const { content = {} } = post || {};
  const { title = 'Untitled Post', featuredImage = null, markdownText = '' } = content;

  return (
    <article className="post-card markdown-post">

      {/* Conditionally render featured image only if URL exists */}
      {featuredImage && (
        <img
            src={featuredImage}
            alt={title ? `Featured image for ${title}` : 'Featured Image'}
            className="featured-image"
            loading="lazy"
         />
      )}

      <div className="post-header-content">
        <h2 className="post-title">{title}</h2>
        {/* Render markdown content area */}
        <div className="post-content">
            {markdownText ? (
                <MarkdownRenderer markdownText={markdownText} />
            ) : (
                <p><em>(This post has no content.)</em></p>
            )}
        </div>
      </div>
    </article>
  );
};

export default MarkdownPost;