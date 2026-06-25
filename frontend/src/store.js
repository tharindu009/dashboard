import { create } from 'zustand';

const useStore = create((set) => ({
  plantData: null,
  pnlData: null,
  spareData: null,
  activeTab: 'plant',
  connected: false,
  lastUpdate: null,
  status: 'connecting',

  setPlantData: (data) =>
    set({ plantData: data, lastUpdate: new Date(), status: 'live' }),

  setPnLData: (data) =>
    set({ pnlData: data, lastUpdate: new Date(), status: 'live' }),

  setSpareData: (data) =>
    set({ spareData: data, lastUpdate: new Date(), status: 'live' }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setConnected: (connected) => set({ connected, status: connected ? 'live' : 'connecting' }),

  setStatus: (status) => set({ status }),
}));

export default useStore;
