import { useEffect, useState } from 'react';

// Wall-clock time that re-renders every `intervalMs`, for countdowns and "time left" labels.
export const useNow = (intervalMs = 1000) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
};
