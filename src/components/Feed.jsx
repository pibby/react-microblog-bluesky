import React from 'react';
import AnimatedPost from './AnimatedPost';
import { formatDistanceToNow } from 'date-fns';

const Feed = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Function to construct the Bluesky post URL
  const getBlueskyPostUrl = (post) => {
    if (!post || !post.id || !post.authorDid) return '#';
    const rkey = post.id.split('/').pop();
    if (!rkey) return '#';
    return `https://bsky.app/profile/${post.authorDid}/post/${rkey}`;
  };

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <div key={post.id} className="post-wrapper">
           <AnimatedPost post={post} />

           {post.timestamp && ( // Check if timestamp exists
             <div className="post-meta">
               {post.type === 'bluesky' && post.authorDid ? ( // Check if it's Bluesky and has authorDid
                 <a
                    href={getBlueskyPostUrl(post)}
                    className="post-meta-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View original post on Bluesky"
                  >
                    {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                  </a>
               ) : (
                 // Render plain text for Markdown or if Bluesky data is missing
                 <span>
                    {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                 </span>
               )}
             </div>
           )}
         </div>
      ))}
    </div>
  );
};

export default Feed;