// src/pages/BlogIndexPage.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Import React Router Link
import AnimatedPost from '../components/AnimatedPost';
import Pagination from '../components/Pagination';
import { formatDistanceToNow } from 'date-fns';

function BlogIndexPage({ markdownPosts, loading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  // Sort MD posts once
  const sortedMdPosts = useMemo(() => {
      if (!Array.isArray(markdownPosts)) return [];
      return [...markdownPosts].sort((a, b) => {
            const timeA = a?.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b?.timestamp ? new Date(b.timestamp).getTime() : 0;
            if (isNaN(timeA) || isNaN(timeB)) return 0;
            return timeB - timeA;
      });
    }, [markdownPosts]
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentBlogPosts = useMemo(() => {
       if (!Array.isArray(sortedMdPosts)) return [];
      return sortedMdPosts.slice(indexOfFirstPost, indexOfLastPost);
   }, [sortedMdPosts, currentPage, postsPerPage]
  );

  const paginate = (pageNumber) => {
     const totalPages = Math.ceil(sortedMdPosts.length / postsPerPage);
     if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <p className="loading-message">Loading posts...</p>;
  }

  if (!sortedMdPosts || sortedMdPosts.length === 0) {
    return <p className="info-message">No blog posts found.</p>;
  }

  return (
    <>
      <h2 className="page-title">Blog Posts</h2>
      <div className="feed-container">
        {/* Loop through calculated posts for the current page */}
        {currentBlogPosts.map((post, index) => { // Add index for fallback key

            // Safety check within loop
            if (!post || !post.id) {
                console.warn(`DEBUG BlogIndexPage Map Loop: Skipping render for invalid post at index ${index}`, post);
                return null;
            }

            return (
                <div key={post.id} className="post-wrapper blog-index-item">
                    <AnimatedPost post={post} />
                    {post.timestamp && (
                         <div className="post-meta">
                             <Link
                                to={`/${post.id}`} // Link to /slug directly
                                className="post-meta-link"
                                title={`View post: ${post.content?.title || 'Untitled'}`} // Add optional chaining
                             >
                                 {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                             </Link>
                         </div>
                     )}
                </div>
            );
        })}
      </div>

      {/* Render pagination controls if needed */}
      {sortedMdPosts.length > postsPerPage && (
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={sortedMdPosts.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
    </>
  );
}

export default BlogIndexPage;