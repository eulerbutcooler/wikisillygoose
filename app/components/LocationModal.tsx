"use client";

import { useLocationStore } from "../utils/store";

export default function LocationModal() {
  const { selectedLocation, showModal, setShowModal, loading } =
    useLocationStore();

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        {loading && (
          <>
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Cool place loading up...
              </h2>
            </div>

            <div className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-gray-600">
                  Finding amazing places near your location...
                </p>
                <div className="text-sm text-gray-500">
                  This may take a few seconds
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && selectedLocation && (
          <>
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Cool Place Found!
              </h2>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                {selectedLocation.name}
              </h3>

              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {selectedLocation.summary}
              </p>

              <div className="flex gap-3">
                <a
                  href={selectedLocation.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-pink-muted hover:bg-violet-gray text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Learn More →
                </a>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
