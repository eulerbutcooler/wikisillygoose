interface Location {
  name: string;
  summary: string;
  link: string;
}

interface UseGeminiLocationsResult {
  error: string | null;
  fetchLocations: (lat: number, lng: number) => Promise<void>;
}

interface LocationState {
  lat: number | null;
  lng: number | null;
  locations: Location[];
  selectedLocation: Location | null;
  showModal: boolean;
  loading: boolean;
  error: string | null;
  setLocations: (locations: Location[]) => void;
  setSelectedLocation: (location: Location | null) => void;
  setShowModal: (show: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  selectRandomLocation: () => void;
}

export type { Location, UseGeminiLocationsResult, LocationState };
