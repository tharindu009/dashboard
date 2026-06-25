import useStore from '../store';
import KpiCards from './KpiCards';
import BatchTable from './BatchTable';
import MiniChart from './MiniChart';

function PlantDashboard() {
  const plantData = useStore((s) => s.plantData);
  const status = useStore((s) => s.status);

  if (status === 'connecting' && !plantData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Connecting to server...
      </div>
    );
  }

  if (status === 'error' && !plantData) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Failed to connect. Make sure the backend is running.
      </div>
    );
  }

  if (!plantData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Waiting for data from plant...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <KpiCards data={plantData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniChart data={plantData} />
        <BatchTable data={plantData} />
      </div>
    </div>
  );
}

export default PlantDashboard;
