import { useEffect } from 'react';
import useStore from '../store';
import socket from '../socket';
import PlantDashboard from './PlantDashboard';

function PlantTab() {
  const setPlantData = useStore((s) => s.setPlantData);

  useEffect(() => {
    socket.on('plant:update', (data) => setPlantData(data));

    fetch('/api/plant')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.lastBatchTimestamp) setPlantData(data);
      })
      .catch(() => {});

    return () => {
      socket.off('plant:update');
    };
  }, []);

  return <PlantDashboard />;
}

export default PlantTab;
