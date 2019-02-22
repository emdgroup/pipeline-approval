import React, { useState, useEffect } from 'react';
import PipelineChanges from './PipelineChanges';

export default function () {
  const [hash, setHash] = useState(document.location.hash);
  useEffect(() => {
    const cb = () => setHash(document.location.hash);
    window.addEventListener('hashchange', cb);
    return () => window.removeEventListener('hashchange', cb);
  }, [document.location.hash]);

  return <PipelineChanges key={hash} />;
}
