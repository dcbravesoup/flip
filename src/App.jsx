import { useState, useEffect } from 'react';
import FlipBookV1 from './FlipBookV1';
import FlipBookV2 from './FlipBookV2';
import FlipBookV3 from './FlipBookV3';
import FlipBookV4 from './FlipBookV4';
import FlipBookV5 from './FlipBookV5';
import FlipBookV6 from './FlipBookV6';

function getRoute() {
  const path = window.location.pathname;
  if (path.startsWith('/v1')) return 'v1';
  if (path.startsWith('/v2')) return 'v2';
  if (path.startsWith('/v3')) return 'v3';
  if (path.startsWith('/v4')) return 'v4';
  if (path.startsWith('/v5')) return 'v5';
  if (path.startsWith('/v6')) return 'v6';
  return 'v1'; // default
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handler = () => setRoute(getRoute());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  if (route === 'v1') return <FlipBookV1 />;
  if (route === 'v2') return <FlipBookV2 />;
  if (route === 'v3') return <FlipBookV3 />;
  if (route === 'v4') return <FlipBookV4 />;
  if (route === 'v5') return <FlipBookV5 />;
  return <FlipBookV6 />;
}
