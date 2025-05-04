---
id: 'welcome'
title: 'Welcome'
timestamp: '2025-04-22T17:00:00Z'
featuredImage: '/blog-images/software-engineer.jpg' # Optional
---

This is a minimalist microblogging feed interface built with React and Vite. It displays a combined feed of local Markdown posts and live Bluesky posts from a specified user, featuring a clean, Medium-inspired design with custom fonts and animations.

## Features

* **Combined Feed:** Integrates posts from two sources into a single, chronologically sorted feed.
* **Markdown Posts:**
    * Loads content from local `.md` files within `/src/content/`.
    * Parses YAML front matter (`gray-matter`) for metadata (ID, title, timestamp, featuredImage).
    * Renders Markdown content (`react-markdown`) including:
        * Paragraphs, headings, lists, links, bold, italics.
        * Featured images displayed prominently.
        * Inline images.
        * Embedded YouTube videos (via custom renderer).
        * Code blocks with syntax highlighting (`react-syntax-highlighter`).
* **Bluesky Integration:**
    * Fetches live data using the official Bluesky API client (`@atproto/api`).
    * Requires authentication via App Password (handled using environment variables).
    * Displays original posts (filters out replies and reposts) from a specified user feed (`getAuthorFeed`).
    * Renders post text with rich text facets (`RichText` helper) for clickable:
        * Links (`app.bsky.richtext.facet#link`)
        * Mentions (`app.bsky.richtext.facet#mention` - links to bsky.app profile)
        * Hashtags (`app.bsky.richtext.facet#tag` - links to bsky.app search)
    * Displays image thumbnails inline.
    * Provides a lightbox (`yet-another-react-lightbox`) for viewing full-size images.
* **User Interface:**
    * Minimalist design with white cards, drop shadows, and gray accents.
    * Custom Google Fonts (Montserrat for UI/headlines, Merriweather for body content).
    * Larger, distinct styling for Bluesky post text (quote-like).
    * Pagination controls for navigating through posts.
    * Search bar to filter posts by keywords in titles or content (including image alt text for Bluesky).
    * Smooth slide-up animation for posts on scroll (`framer-motion`).
    * Basic responsive considerations.

## Tech Stack

* **Framework:** React 18+
* **Build Tool:** Vite 5+
* **Styling:** Plain CSS / CSS Modules (`src/App.css`)
* **Bluesky API Client:** `@atproto/api`
* **Markdown:**
    * `react-markdown` (Rendering)
    * `gray-matter` (Front Matter Parsing)
    * `react-syntax-highlighter` (Code Blocks)
* **Animation:** `framer-motion`
* **Image Lightbox:** `yet-another-react-lightbox`
* **Date Formatting:** `date-fns`
* **Node.js Polyfills (for Browser):** `vite-plugin-node-polyfills` (Handles `Buffer` dependency from `gray-matter`)
* **Language:** JavaScript (JSX)

```javascript
// Code blocks work too
console.log('Hello, Markdown!');