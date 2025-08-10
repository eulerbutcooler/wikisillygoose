"use client";

import dynamic from "next/dynamic";
import LocationModal from "./components/LocationModal";
import Topbar from "./components/Topbar";
import GlobeLoadingSkeleton from "./components/GlobeLoadingSkeleton";

const ThreeGlobe = dynamic(() => import("./components/Globe"), {
  ssr: false,
  loading: () => <GlobeLoadingSkeleton />,
});

export default function Home() {
  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ThreeGlobe />
      </div>

      <div className="absolute top-0 left-0 w-full flex justify-center z-10 pointer-events-none">
        <div className="pointer-events-auto mt-10">
          <Topbar />
        </div>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <LocationModal />
        </div>
      </div>
    </div>
  );
}
