import { useState, useMemo } from 'react';
import useStore from '../store';

function SpareDashboard() {
  const spareData = useStore((s) => s.spareData);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('closingStock');
  const [sortDir, setSortDir] = useState('asc');
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);

  const filtered = useMemo(() => {
    if (!spareData || !spareData.parts) return [];

    let items = spareData.parts;

    if (showAlertsOnly) {
      items = items.filter((p) => p.closingStock === 0);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.materialDescription.toLowerCase().includes(q) ||
          p.materialCode.toLowerCase().includes(q) ||
          p.unit.toLowerCase().includes(q)
      );
    }

    items = [...items].sort((a, b) => {
      const va = a[sortField] ?? '';
      const vb = b[sortField] ?? '';
      const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return items;
  }, [spareData, search, sortField, sortDir, showAlertsOnly]);

  if (!spareData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Waiting for spare parts data...
      </div>
    );
  }

  function toggleSort(field) {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  }

  const formatCurrency = (v) => {
    if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
    if (v >= 1e3) return (v / 1e3).toFixed(1) + 'K';
    return v.toFixed(0);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Items</p>
          <p className="text-2xl font-bold text-gray-900">{spareData.totalItems}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Stock Value</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(spareData.totalStockValue)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Zero Stock Items</p>
          <p className="text-2xl font-bold text-red-600">{spareData.zeroStockItems}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Last Updated</p>
          <p className="text-lg font-bold text-gray-900">
            {new Date(spareData.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by name, code, or unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showAlertsOnly}
              onChange={(e) => setShowAlertsOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            Zero stock only
          </label>
          <span className="text-xs text-gray-400">{filtered.length} items</span>
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <Th onClick={() => toggleSort('materialDescription')} active={sortField === 'materialDescription'} dir={sortDir}>
                  Description
                </Th>
                <Th onClick={() => toggleSort('unit')} active={sortField === 'unit'} dir={sortDir}>
                  Unit
                </Th>
                <Th onClick={() => toggleSort('closingStock')} active={sortField === 'closingStock'} dir={sortDir} right>
                  Stock
                </Th>
                <Th onClick={() => toggleSort('closingValue')} active={sortField === 'closingValue'} dir={sortDir} right>
                  Value
                </Th>
                <Th onClick={() => toggleSort('materialCode')} active={sortField === 'materialCode'} dir={sortDir}>
                  Code
                </Th>
                <Th onClick={() => toggleSort('totalIssueQty')} active={sortField === 'totalIssueQty'} dir={sortDir} right>
                  Issued
                </Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.slice(0, 200).map((p, i) => (
                <tr
                  key={i}
                  className={`hover:bg-gray-50 ${p.closingStock === 0 ? 'bg-red-50' : ''}`}
                >
                  <td className="px-4 py-2 text-gray-900 max-w-[300px] truncate">
                    {p.materialDescription}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{p.unit}</td>
                  <td className={`px-4 py-2 text-right font-medium ${p.closingStock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {p.closingStock}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700">
                    {formatCurrency(p.closingValue)}
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-xs font-mono">
                    {p.materialCode}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-700">
                    {p.totalIssueQty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 200 && (
            <p className="text-xs text-gray-400 text-center py-3">
              Showing 200 of {filtered.length} items. Refine search for more specific results.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Th({ children, onClick, active, dir, right }) {
  return (
    <th
      onClick={onClick}
      className={`px-4 py-3 font-medium cursor-pointer select-none hover:text-gray-700 ${right ? 'text-right' : 'text-left'}`}
    >
      {children}
      {active && <span className="ml-1">{dir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );
}

export default SpareDashboard;
