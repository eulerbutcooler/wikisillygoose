import { useState } from "react";
import { useLocationStore } from "./store";
import { UseGeminiLocationsResult } from "../types/types";

export function UseGeminiLocations(): UseGeminiLocationsResult {
  const [error, setError] = useState<string | null>(null);
  const { setLocations, setLoading, selectRandomLocation, setShowModal } =
    useLocationStore();

  const fetchLocations = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    setShowModal(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lng }),
      });
      if (!response.ok) {
        throw new Error(`Error generating response: ${response.status}`);
      }
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setLocations(data.sillyg || []);
      selectRandomLocation();
    } catch (err) {
      setError(err instanceof Error ? err.message : `An error occured`);
      setShowModal(false);
      console.error(`Error fetching locations: `, err);
    } finally {
      setLoading(false);
    }
  };

  return { error, fetchLocations };
}
