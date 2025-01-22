"use client";
import React, { useEffect, useRef } from "react";
import { useD3 } from "../hooks/useD3";

export default function Page() {
  const mapRef = useRef<any>(null);
  const { createD3Canvas, setProjection } = useD3();

  useEffect(() => {
    if (mapRef.current) {
      const svg = createD3Canvas(mapRef.current, 600, 800);
      const path = setProjection(600, 800);
    }
  }, [mapRef.current]);

  return (
    <div className="w-screen h-screen max-w-4xl mx-auto">
      <div
        ref={mapRef}
        className="w-[600px] h-[800px] border rounded-lg shadow-lg p-4 bg-white"
      ></div>
    </div>
  );
}
