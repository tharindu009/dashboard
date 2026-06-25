import { useEffect, useState } from 'react';
import useStore from '../store';
import socket from '../socket';
import SpareDashboard from './SpareDashboard';

function SpareTab() {
  const setSpareData = useStore((s) => s.setSpareData);

  useEffect(() => {
    socket.on('spare:update', (data) => setSpareData(data));

    fetch('/api/spare-parts')
      .then((r) => r.json())
      .then((data) => { if (data && data.parts) setSpareData(data); })
      .catch(() => {});

    return () => { socket.off('spare:update'); };
  }, []);

  return <SpareDashboard />;
}

export default SpareTab;
