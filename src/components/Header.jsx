import React from 'react';

function Header({ logoSrc, title, description, searchQuery, setSearchQuery }) {
  return (
    <header className="site-header">
      <div className="header-content">
        <div className="logo-container">
         {logoSrc && <a href="/"><img src={logoSrc} alt={`${title} Logo`} className="logo-image" /></a>}
        </div>
        <div className="header-text">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>
         <div className="search-bar">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
    </header>
  );
}

export default Header;