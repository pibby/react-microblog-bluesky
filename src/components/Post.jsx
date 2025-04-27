import React from 'react';
import MarkdownPost from './MarkdownPost';
import BlueskyPost from './BlueskyPost';

const Post = ({ post }) => {

  // Add a check for post existence
  if (!post || !post.type) {
      console.warn('Received invalid post data:', post);
      return <div className="post-card error-post">Invalid post data.</div>;
  }

  switch (post.type) {
    case 'markdown':
      return <MarkdownPost post={post} />;
    case 'bluesky':
      return <BlueskyPost content={post.content} />;
    default:
      console.warn('Unknown post type:', post.type);
      return <div className="post-card unknown-post">Unsupported post type: {post.type}</div>;
  }
};

export default Post;