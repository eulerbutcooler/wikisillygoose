import { create } from "zustand";
import { LocationState } from "../types/types";

export const useLocationStore = create<LocationState>((set, get) => ({
  lat: null,
  lng: null,
  locations: [],
  selectedLocation: null,
  showModal: false,
  loading: false,
  error: null,
  setLocations: (locations) => set({ locations }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setShowModal: (show) => set({ showModal: show }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  selectRandomLocation: () => {
    const { locations } = get();
    if (locations.length > 0) {
      const randomIndex = Math.floor(Math.random() * locations.length);
      const selectedLocation = locations[randomIndex];
      set({ selectedLocation, showModal: true });
    }
  },
}));
