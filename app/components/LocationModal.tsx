"use client";

import { useLocationStore } from "../utils/store";

export default function LocationModal() {
  const { selectedLocation, showModal, setShowModal, loading } =
    useLocationStore();

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-500">
      <div
        className="bg-white/10 backdrop-blur-lg border border-white/20
                   rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto
                   shadow-2xl transform transition-all duration-300
                   animate-in fade-in-0 zoom-in-95"
      >
        {loading && (
          <>
            <div className="flex justify-between items-center p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">
                Cool place loading up...
              </h2>
            </div>

            <div className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
                <p className="text-white/80">
                  Finding amazing places near your location...
                </p>
                <div className="text-sm text-white/60">
                  This may take a few seconds
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && selectedLocation && (
          <>
            <div className="flex justify-between items-center p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">
                Cool Place Found!
              </h2>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">
                {selectedLocation.name}
              </h3>

              <p className="text-white/80 text-sm leading-relaxed mb-4">
                {selectedLocation.summary}
              </p>

              <div className="flex gap-3">
                <a
                  href={selectedLocation.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500/80 hover:bg-violet-gray/80 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Learn More →
                </a>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
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
