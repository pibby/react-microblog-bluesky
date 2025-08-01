import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Routes, Route, Link } from 'react-router-dom';
import { BskyAgent } from '@atproto/api';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import BlogIndexPage from './pages/BlogIndexPage';
import RootSlugPostPage from './pages/RootSlugPostPage';
import RouteChangeTracker from './components/RouteChangeTracker';
import ManualScrollToTop from './components/ManualScrollToTop';
import matter from 'gray-matter';
import './App.css';

// --- Initialize Google Analytics ---
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
} else {
  console.warn("GA4 Measurement ID not found in .env file (VITE_GA_MEASUREMENT_ID). Analytics disabled.");
}
// --- End GA Initialization ---

const markdownFiles = import.meta.glob('/src/content/*.md', {
    query: '?raw',
    import: 'default',
    eager: true
});

const loadedMarkdownPosts = Object.entries(markdownFiles).map(([path, rawContent]) => {
    try {
        const { data, content } = matter(rawContent);
        const id = data.id || path.split('/').pop().replace('.md', ''); // Use id as slug source
        if (!data.timestamp || !data.title) throw new Error(`Missing required front matter (title or timestamp) in ${path}`);
        const postContent = {
            title: data.title || 'Untitled',
            featuredImage: data.featuredImage || null,
            markdownText: content || ''
        };
        return { id, type: 'markdown', timestamp: data.timestamp, content: postContent };
    } catch (e) { console.warn(`DEBUG: Error processing Markdown ${path}: ${e.message}. Skipping.`); return null; }
}).filter(Boolean);

function App() {
  const [allPosts, setAllPosts] = useState([]); // For combined homepage feed
  const [markdownPostsOnly] = useState(loadedMarkdownPosts); // Just MD posts for blog pages
  const [loading, setLoading] = useState(true); // Global loading state
  const [error, setError] = useState(null); // Global error state
  const [searchQuery, setSearchQuery] = useState(''); // Global search state

  // --- Effect for Fetching Bluesky Data ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let fetchedBlueskyPosts = [];
      try {
        // --- Bluesky API Fetch ---
        const handle = import.meta.env.VITE_BSKY_HANDLE;
        const password = import.meta.env.VITE_BSKY_APP_PASSWORD;
        if (handle && password) {
            const agent = new BskyAgent({ service: 'https://bsky.social' });
            await agent.login({ identifier: handle, password });
            const actorToFetch = handle;
            const response = await agent.getAuthorFeed({ actor: actorToFetch, limit: 100 });
            if (!response.success) throw new Error("Failed to fetch Bluesky feed.");
            // Process feed: Filter and Transform
            fetchedBlueskyPosts = response.data.feed
              .filter(item => !item.reply && !item.reason) // Filter replies/reposts
              .map(item => {
                  const post = item.post;
                  // Add check for authorDid as it's needed for Bsky permalink on HomePage
                  if (!post?.record || !post?.uri || !post?.record?.createdAt || !post?.author?.did) return null;
                  const embedData = post.embed;

                  const images = (embedData?.$type === 'app.bsky.embed.images#view' && Array.isArray(embedData.images)) ? embedData.images : [];

                  // ADD logic to extract video data
                  let video = null; // Default to null
                  // Construct the video object using the correct properties from the API response
                  if (embedData?.$type === 'app.bsky.embed.video#view' && embedData.playlist && embedData.thumbnail) {
      
                    // Construct the video object using the direct properties from the API
                    video = {
                        thumbUrl: embedData.thumbnail,
                        playlistUrl: embedData.playlist, // <<< STORE THIS
                        alt: embedData.alt || ''
                    };
                }

                  const postContent = {
                      text: post.record.text || '',
                      facets: post.record.facets || [],
                      images: images.map(img => ({ thumb: img.thumb, fullsize: img.fullsize, alt: img.alt || '', aspectRatio: img.aspectRatio })),
                      video: video
                  };
                  // Include authorDid for HomePage Bsky links
                  return { id: post.uri, type: 'bluesky', timestamp: post.record.createdAt, authorDid: post.author.did, content: postContent };
              }).filter(Boolean); // Filter out nulls
        } else { console.warn("Skipping Bluesky fetch due to missing credentials."); }
         // --- End Bluesky API Fetch ---
      } catch (err) {
        console.error("Bluesky API Error:", err);
        setError(`Failed to load Bluesky posts: ${err.message}.`); // Set error state
      }

      // Combine posts for the homepage feed state
      const combined = [...fetchedBlueskyPosts, ...markdownPostsOnly];
      // Sort combined posts by timestamp
      const sortedCombined = combined.sort((a, b) => {
        const timeA = a?.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b?.timestamp ? new Date(b.timestamp).getTime() : 0;
        if (isNaN(timeA) || isNaN(timeB)) return 0;
        return timeB - timeA; // Descending order
      });

      setAllPosts(sortedCombined); // Update state for homepage
      setLoading(false); // Finish loading
    };

    fetchData();
  }, [markdownPostsOnly]);

  return (
    <div className="app-container">
      <RouteChangeTracker />
      <ManualScrollToTop />
      <Header
        logoSrc="/katie-harron.jpg"
        title="Katie Harron"
        description="Software Engineer @slack. Broadway, musicals, USWNT, Lionesses, Arsenal WFC, Boston Bruins, F1, TLOU, Severance, Yellowjackets, Outlander, Dungeons and Dragons"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main>
        {/* Define Routes */}
        <Routes>
           {/* Route for the combined feed homepage */}
           <Route
             path="/"
             element={
               <HomePage
                 allPosts={allPosts} // Pass combined posts
                 loading={loading}
                 error={error}
                 searchQuery={searchQuery} // Pass search query
               />
             }
            />
            {/* Route for the blog index page */}
            <Route
               path="/posts"
               element={
                 <BlogIndexPage
                    markdownPosts={markdownPostsOnly} // Pass only MD posts
                    // Loading if MD posts somehow haven't loaded yet
                    loading={markdownPostsOnly.length === 0 && loading}
                 />
               }
             />
             {/* Route for a single blog post detail page at root slug */}
             <Route
                path="/:slug" // Use :slug at root level
                element={
                  <RootSlugPostPage
                     markdownPosts={markdownPostsOnly} // Pass MD posts to find the match
                     loading={markdownPostsOnly.length === 0 && loading}
                  />
                }
             />
             {/* Catch-all 404 Route */}
             <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Render Footer only when not loading initial data */}
      {!loading && <Footer />}
    </div>
  );
}

// Simple Footer component (can be in its own file: src/components/Footer.jsx)
function Footer() {
    return (
        <footer>
            <p><a href="/"><img src="/lumi-katie-slack.png" alt="Lumi and Katie" width="120" height="120" /></a></p>
        </footer>
    );
}

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go back to the Homepage</Link>
    </div>
  );
}

export default App;