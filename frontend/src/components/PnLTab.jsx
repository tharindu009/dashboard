import { useEffect } from 'react';
import useStore from '../store';
import socket from '../socket';
import PnLDashboard from './PnLDashboard';

function PnLTab() {
  const setPnLData = useStore((s) => s.setPnLData);

  useEffect(() => {
    socket.on('pnl:update', (data) => {
      setPnLData(data);
    });

    fetch('/api/pnl')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.rows) setPnLData(data);
      })
      .catch(() => {});

    return () => {
      socket.off('pnl:update');
    };
  }, []);

  return <PnLDashboard />;
}

export default PnLTab;
