"use client";

import { useLocationStore } from "../utils/store";

export default function Wiki() {
  const { lat, lng, loading, error } = useLocationStore();

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Cool Places Finder</h2>

      {lat === null || lng === null ? (
        <p className="text-gray-600">
          Click on the globe to discover cool places around that location!
        </p>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            📍 Latitude: {lat.toFixed(4)}°, Longitude: {lng.toFixed(4)}°
          </p>

          {loading && (
            <div className="flex items-center gap-2 mb-4">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              <span>Finding cool places nearby...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Error: {error}
            </div>
          )}

          {!loading && !error && (
            <p className="text-gray-600 text-sm">
              ✨ A cool place will appear in a popup when found!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
