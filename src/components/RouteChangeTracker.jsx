import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

function RouteChangeTracker() {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (GA_MEASUREMENT_ID && !initialized) {
        ReactGA.initialize(GA_MEASUREMENT_ID);
        setInitialized(true);
    }
  }, [initialized]);

  // Track page views based on location changes
  useEffect(() => {
    if (initialized) {
      const pagePath = location.pathname + location.search;
      ReactGA.send({ hitType: "pageview", page: pagePath, title: document.title }); // Send pageview hit
    }
  }, [initialized, location]);

  return null;
}

export default RouteChangeTracker;