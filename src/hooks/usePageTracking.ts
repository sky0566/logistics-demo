'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function usePageTracking() {
  const pathname = usePathname();
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;

    const send = (heartbeat = false) => {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_path: pathname,
          page_title: document.title,
          referrer: heartbeat ? '' : document.referrer,
          heartbeat,
        }),
      }).catch(() => {});
    };

    const timer = setTimeout(() => send(false), 500);
    heartbeatRef.current = setInterval(() => send(true), 60_000);

    return () => {
      clearTimeout(timer);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [pathname]);
}
