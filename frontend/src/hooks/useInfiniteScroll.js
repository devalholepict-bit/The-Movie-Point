import { useEffect, useRef, useState } from 'react';

const useInfiniteScroll = (callback, hasMore, loading) => {
  const sentinelRef = useRef(null);
  const [targetElement, setTargetElement] = useState(null);

  useEffect(() => {
    if (sentinelRef.current) setTargetElement(sentinelRef.current);
  }, []);

  useEffect(() => {
    if (!targetElement || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(targetElement);
    return () => observer.disconnect();
  }, [targetElement, hasMore, loading, callback]);

  return sentinelRef;
};

export default useInfiniteScroll;
