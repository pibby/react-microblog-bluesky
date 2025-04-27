import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ManualScrollToTop() {
  // Get the current location object using the hook
  const { pathname } = useLocation();

  // useEffect hook that runs every time the pathname changes
  useEffect(() => {
    try {
        window.scrollTo(0, 0);
    } catch (error) {
        console.error("ScrollToTop failed:", error);
    }
  }, [pathname]); // Dependency array: only run effect when pathname changes

  return null;
}

export default ManualScrollToTop;