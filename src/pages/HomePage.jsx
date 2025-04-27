import React, { useState, useMemo, useEffect } from 'react';
import AnimatedPost from '../components/AnimatedPost';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function HomePage({ allPosts, loading, error, searchQuery }) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8; // Number of posts to display per page on the homepage

   // Filter posts based on search query received from App
   const filteredPosts = useMemo(() => {
    if (!Array.isArray(allPosts)) return [];
    if (!searchQuery) return allPosts;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allPosts.filter(post => {
        if (!post || typeof post.content !== 'object' || post.content === null) return false;
        if (post.type === 'markdown') {
            const titleMatch = (typeof post.content.title === 'string' ? post.content.title : '').toLowerCase().includes(lowerCaseQuery);
            const contentMatch = (typeof post.content.markdownText === 'string' ? post.content.markdownText : '').toLowerCase().includes(lowerCaseQuery);
            return titleMatch || contentMatch;
        } else if (post.type === 'bluesky') {
             const textMatch = (typeof post.content.text === 'string' ? post.content.text : '').toLowerCase().includes(lowerCaseQuery);
             const imageAltMatch = post.content.images?.some(img => (typeof img.alt === 'string' ? img.alt : '').toLowerCase().includes(lowerCaseQuery));
             return textMatch || imageAltMatch;
        }
        return false;
    });
  }, [searchQuery, allPosts]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = useMemo(() => {
       if (!Array.isArray(filteredPosts)) return [];
      return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
   }, [filteredPosts, currentPage, postsPerPage]
  );

  const paginate = (pageNumber) => {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  if (loading) {
    return <p className="loading-message">Loading posts...</p>;
  }
  if (error && allPosts.length === 0) {
      return <p className="error-message">{error}</p>;
  }

  return (
    <>
      {error && <p className="error-message" style={{marginBottom: '1rem'}}>{error}</p>}

      <div className="feed-container">
         {currentPosts.map((post, index) => {

             if (!post || !post.id) {
                 return null;
             }

            // Calculate Bluesky URL
            let postUrl = '#';
            let isBluesky = post.type === 'bluesky';
            if (isBluesky && post.authorDid) { // Check authorDid as well
                const rkey = post.id.split('/').pop();
                if (rkey) postUrl = `https://bsky.app/profile/${post.authorDid}/post/${rkey}`;
            }

            return (
                <div key={post.id} className="post-wrapper">
                    <AnimatedPost post={post} />
                    {post.timestamp && (
                        <div className="post-meta">
                            {isBluesky ? (
                                <a href={postUrl} className="post-meta-link" target="_blank" rel="noopener noreferrer" title="View original post on Bluesky">
                                    {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                                </a>
                            ) : (
                                <Link
                                    to={`/${post.id}`}
                                    className="post-meta-link"
                                    title={`View post: ${post.content?.title || 'Untitled'}`} // Add title attribute
                                >
                                    {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            );
         })}
      </div>

      {/* Render pagination controls */}
      {filteredPosts.length > postsPerPage && (
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={filteredPosts.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}

      {/* No Results Messages */}
      {filteredPosts.length === 0 && searchQuery && (
           <p className="info-message">No posts match your search query: "{searchQuery}".</p>
      )}
      {allPosts.length === 0 && !searchQuery && !loading && !error && (
           <p className="info-message">No posts available to display.</p>
      )}
    </>
  );
}

export default HomePage;