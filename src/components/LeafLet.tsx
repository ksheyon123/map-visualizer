import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import L from "leaflet";

export const LeafletD3Map = () => {
  const mapRef = useRef<any>(null);
  // const svgRef = useRef<any>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    // 서울 시청
    const x = 37.5665;
    const y = 126.978;
    // Leaflet 맵 초기화
    const map = L.map(mapRef.current, {
      // 맵 옵션 추가
      center: [x, y],
      zoom: 12,
      maxBounds: [
        [33.0, 124.0], // 남서쪽 경계
        [43.0, 132.0], // 북동쪽 경계
      ],
      minZoom: 7, // 최소 줌 레벨
      maxZoom: 18, // 최대 줌 레벨
      worldCopyJump: true,
    }).setView([x, y], 12);

    // https://leaflet-extras.github.io/leaflet-providers/preview/
    const layers = [
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
    ];

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer(layers[2]).addTo(map);
    mapInstance.current = map;

    // SVG 오버레이 생성
    const svg = d3
      .select(map.getPanes().overlayPane)
      .append("svg")
      .attr("class", "leaflet-zoom-hide");

    // svgRef.current = svg;

    // 샘플 데이터
    const sampleData = [
      { lat: 37.5665, lng: 126.978, value: 100 }, // 서울
      { lat: 37.5311, lng: 126.9168, value: 75 }, // 영등포
      { lat: 37.599, lng: 127.0328, value: 50 }, // 동대문
    ];

    // D3 시각화 함수
    const updateD3Overlay = () => {
      const bounds = map.getBounds();

      // SVG 컨테이너 위치 업데이트
      const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
      const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

      svg
        .style("left", `${topLeft.x}px`)
        .style("top", `${topLeft.y}px`)
        .style("width", `${bottomRight.x - topLeft.x}px`)
        .style("height", `${bottomRight.y - topLeft.y}px`);

      // 데이터 포인트 업데이트
      const circles = svg.selectAll("circle").data(sampleData);

      circles
        .enter()
        .append("circle")
        .merge(circles as any)
        .attr("cx", (d) => map.latLngToLayerPoint([d.lat, d.lng]).x - topLeft.x)
        .attr("cy", (d) => map.latLngToLayerPoint([d.lat, d.lng]).y - topLeft.y)
        .attr("r", (d) => d.value / 10)
        .attr("fill", "red")
        .attr("fill-opacity", 0.6)
        .attr("stroke", "white")
        .attr("stroke-width", 1);

      circles.exit().remove();
    };

    // 맵 이벤트 리스너 등록
    map.on("moveend", updateD3Overlay);
    updateD3Overlay();

    // 클린업 함수
    return () => {
      map.remove();
      svg.remove();
    };
  }, []);

  return (
    <div className="w-[600px] h-[800px] relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};
