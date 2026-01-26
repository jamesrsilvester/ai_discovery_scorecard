import { useEffect } from 'react';
import Tracker from '@openreplay/tracker';

export default function OpenReplayTracker() {
  useEffect(() => {
    // Check if running on client side
    if (typeof window !== 'undefined') {
      const projectKey = process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY;

      if (!projectKey) {
        console.warn('OpenReplay Project Key not found. Please set NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY in your environment variables.');
        return;
      }

      const tracker = new Tracker({
        projectKey: projectKey,
        __DISABLE_SECURE_MODE: process.env.NODE_ENV === 'development', // Allow running on localhost only in dev
        // ingestPoint: "https://generated-ingest-point.openreplay.com/ingest", // Optional: If using self-hosted or specific ingest point
      });

      tracker.start();
    }
  }, []);

  return null;
}
