import { useEffect } from 'react';
import useStore from './store';
import PlantTab from './components/PlantTab';
import PnLTab from './components/PnLTab';
import SpareTab from './components/SpareTab';

const tabs = [
  { id: 'plant', label: 'Plant Production' },
  { id: 'pnl', label: 'Financial P&L' },
  { id: 'spare', label: 'Spare Parts' },
];

function App() {
  const setPlantData = useStore((s) => s.setPlantData);
  const setPnLData = useStore((s) => s.setPnLData);
  const setSpareData = useStore((s) => s.setSpareData);
  const setStatus = useStore((s) => s.setStatus);
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const status = useStore((s) => s.status);

  useEffect(() => {
    const fetchAll = () => {
      Promise.all([
        fetch('/api/plant').then((r) => r.json()).then((d) => {
          if (d && d.lastBatchTimestamp) setPlantData(d);
        }),
        fetch('/api/pnl').then((r) => r.json()).then((d) => {
          if (d && d.rows) setPnLData(d);
        }),
        fetch('/api/spare-parts').then((r) => r.json()).then((d) => {
          if (d && d.parts) setSpareData(d);
        }),
      ]).catch(() => setStatus('error'));
    };
    fetchAll();
    const timer = setInterval(fetchAll, 4000);
    return () => clearInterval(timer);
  }, []);

  const statusColor = { live: 'bg-green-500', connecting: 'bg-yellow-500', error: 'bg-red-500', waiting: 'bg-gray-400' };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Mathugama Asphalt Plant</h1>
          <p className="text-xs text-gray-500">TTM LB 2000 — Real-time Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${statusColor[status] || 'bg-gray-400'}`} />
          <span className="text-xs text-gray-600 capitalize">{status}</span>
        </div>
      </header>

      <div className="border-b border-gray-200 bg-white px-6">
        <nav className="flex gap-6 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 pt-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <main className="p-6">
        {activeTab === 'plant' && <PlantTab />}
        {activeTab === 'pnl' && <PnLTab />}
        {activeTab === 'spare' && <SpareTab />}
      </main>
    </div>
  );
}

export default App;
