import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import L from "leaflet";
import nodes from "@/constants/NODE.json";
import links from "@/constants/LINK.json";
import { LinkFeature, NodeFeature } from "@/types/type.d3";

export const LeafletD3Map = () => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const cx = 37.5;
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
      "https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png",
      "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
    ];

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer(layers[0]).addTo(map);

    // SVG 오버레이 생성
    const svg = d3
      .select(map.getPanes().overlayPane)
      .append("svg")
      .attr("class", "leaflet-zoom-hide");

    const pathG = svg.append("g").attr("class", "map-link-container");
    const circleG = svg.append("g").attr("class", "map-node-container");

    // D3 시각화 함수
    const updateD3Overlay = () => {
      const bounds = map.getBounds();

      // SVG 컨테이너 위치 업데이트
      const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
      const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

      // SVG 좌우상하 끝점 좌표, 지도 움직임에 따라서 노출 영역 변환
      svg
        .style("left", `${topLeft.x}px`)
        .style("top", `${topLeft.y}px`)
        .style("width", `${bottomRight.x - topLeft.x}px`)
        .style("height", `${bottomRight.y - topLeft.y}px`);

      pathG.attr("transform", `translate(${-topLeft.x},${-topLeft.y})`);
      const pathes = pathG
        .selectAll("path")
        .data(links.features as LinkFeature[]);

      pathes
        .enter()
        .append("path")
        .merge(pathes as any)
        .attr("d", (d) => {
          const coordinates = d.geometry.coordinates;
          const points = coordinates.map((coord) => {
            const point = map.latLngToLayerPoint([coord[1], coord[0]]);
            return `${point.x},${point.y}`;
          });
          return `M${points.join("L")}`;
        })
        .attr("fill", "none")
        .attr("stroke", "#3498db")
        .attr("stroke-width", 2)
        .attr("class", "hover:opacity-80 transition-opacity");

      circleG.attr("transform", `translate(${-topLeft.x},${-topLeft.y})`);
      // 데이터 포인트 업데이트
      const circles = circleG
        .selectAll("circle")
        .data(nodes.features as NodeFeature[]);

      circles
        .enter()
        .append("circle")
        .merge(circles as any)
        .attr(
          "cx",
          (d: NodeFeature) =>
            map.latLngToLayerPoint({
              lat: d.geometry.coordinates[1],
              lng: d.geometry.coordinates[0],
            }).x
        )
        .attr(
          "cy",
          (d: NodeFeature) =>
            map.latLngToLayerPoint({
              lat: d.geometry.coordinates[1],
              lng: d.geometry.coordinates[0],
            }).y
        )
        .attr("r", 3)
        .attr("fill", "red")
        .attr("fill-opacity", 0.6)
        .attr("stroke", "white")
        .attr("stroke-width", 1);

      pathes.exit().remove();
      circles.exit().remove();
    };

    // 맵 이벤트 리스너 등록
    map.on("moveend", updateD3Overlay);
    updateD3Overlay();

    // 클린업 함수
    return () => {
      map.remove();
      svg.remove();
      pathG.remove();
      circleG.remove();
    };
  }, []);

  return (
    <div className="w-[600px] h-[800px] relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};
