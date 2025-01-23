import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import L from "leaflet";
import nodes from "@/constants/NODE.json";
import { NodeFeature } from "@/types/type.d3";
import proj4 from "proj4";

export const LeafletD3Map = () => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // 서울 시청
    const cx = 38;
    const cy = 127.5;
    // Leaflet 맵 초기화
    const map = L.map(mapRef.current, {
      // 맵 옵션 추가
      center: [cx, cy],
      zoom: 12,
      maxBounds: [
        [33.0, 124.0], // 남서쪽 경계
        [43.0, 132.0], // 북동쪽 경계
      ],
      minZoom: 7, // 최소 줌 레벨
      maxZoom: 18, // 최대 줌 레벨
      worldCopyJump: true,
    }).setView([cx, cy], 9);

    // Leaflet map list : https://leaflet-extras.github.io/leaflet-providers/preview/
    const layers = [
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
    ];

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer(layers[2]).addTo(map);

    // SVG 오버레이 생성
    const svg = d3
      .select(map.getPanes().overlayPane)
      .append("svg")
      .attr("class", "leaflet-zoom-hide");

    // D3 시각화 함수
    const updateD3Overlay = () => {
      const bounds = map.getBounds();

      // SVG 컨테이너 위치 업데이트
      const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
      const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

      // SVG 좌우상하 끝점 좌표
      svg
        .style("left", `${topLeft.x}px`)
        .style("top", `${topLeft.y}px`)
        .style("width", `${bottomRight.x - topLeft.x}px`)
        .style("height", `${bottomRight.y - topLeft.y}px`);

      // 데이터 포인트 업데이트
      const circles = svg
        .selectAll("circle")
        .data(nodes.features as NodeFeature[]);

      circles
        .enter()
        .append("circle")
        .merge(circles as any)
        .attr("cx", (d: NodeFeature) => {
          return (
            map.latLngToLayerPoint({
              lat: d.geometry.coordinates[1],
              lng: d.geometry.coordinates[0],
            }).x - topLeft.x
          );
        })
        .attr("cy", (d: NodeFeature) => {
          return (
            map.latLngToLayerPoint({
              lat: d.geometry.coordinates[1],
              lng: d.geometry.coordinates[0],
            }).y - topLeft.y
          );
        })
        .attr("r", 3)
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
