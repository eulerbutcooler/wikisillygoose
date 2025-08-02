"use client";

import dynamic from "next/dynamic";
import LocationModal from "./components/LocationModal";
import Topbar from "./components/Topbar";

const ThreeGlobe = dynamic(() => import("./components/Globe"), {
  ssr: false,
  loading: () => <p>Loading globe...</p>,
});

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center bg-black">
        <Topbar></Topbar>
        <div>
          <ThreeGlobe />
          <LocationModal />
        </div>
      </div>
    </div>
  );
}
