import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownPost from '../components/MarkdownPost';

// Add any other top-level page routes here (e.g., 'about', 'contact')
const RESERVED_PATHS = ['posts'];

function RootSlugPostPage({ markdownPosts, loading }) {
  const { slug } = useParams(); // Get slug from URL

  // Immediately check if the requested slug is actually a reserved route path
  if (RESERVED_PATHS.includes(slug?.toLowerCase())) {
      // If the slug matches a page route like '/posts', treat it as Not Found here.
      // The router in App.jsx should have matched the specific '/posts' route first anyway,
      // but this is a safeguard.
      return "Not Found.";
  }

  // Find the post based on the slug (which is the post.id)
  const post = useMemo(() => {
      if (!Array.isArray(markdownPosts)) return null;
      // Find post where the ID matches the slug from the URL
      return markdownPosts.find(p => p.id === slug);
  }, [markdownPosts, slug]);

  // Handle loading state
  if (loading) {
    return <p className="loading-message">Loading post...</p>;
  }

  // Render the single MarkdownPost component
  return (
    <div className="blog-post-detail root-slug-detail">
      <MarkdownPost post={post} />
    </div>
  );
}

export default RootSlugPostPage;