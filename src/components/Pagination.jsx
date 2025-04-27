import React from 'react';

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {

  const pageNumbers = [];
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Calculate page numbers to display
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Page navigation">
      <ul className='pagination'>
        {/* Previous Button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            onClick={() => paginate(currentPage - 1)} // Call prop function
            className='page-link'
            disabled={currentPage === 1}
            aria-label="Previous"
          >
            « Prev
          </button>
        </li>

        {/* Page Number Buttons */}
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button
              onClick={() => paginate(number)} // Call prop function
              className='page-link'
              aria-current={currentPage === number ? 'page' : undefined}
            >
              {number}
            </button>
          </li>
        ))}

         {/* Next Button */}
         <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            onClick={() => paginate(currentPage + 1)} // Call prop function
            className='page-link'
            disabled={currentPage === totalPages}
            aria-label="Next"
          >
             Next »
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;