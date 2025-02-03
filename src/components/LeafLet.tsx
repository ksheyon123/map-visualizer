import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import L from "leaflet";
import nodes from "@/constants/NODE.json";
import links from "@/constants/LINK.json";
import { layoutContour } from "@/utils/d3Utils";
import { useD3Overlay } from "@/hooks/useD3Overlay";

export const LeafletD3Map = () => {
  const mapRef = useRef<any>(null);
  const { setGroup, drawLink, drawNode } = useD3Overlay();
  useEffect(() => {
    const cx = 36.5;
    const cy = 127.8;
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
    }).setView([cx, cy], 8);

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

    const pg = setGroup(svg, "map-link-container");
    const cg = setGroup(svg, "map-node-container");

    // D3 시각화 함수
    const updateD3Overlay = () => {
      layoutContour(map, svg, pg, cg);

      const pathes = drawLink(map, pg, links.features);
      const circles = drawNode(map, cg, nodes.features);
      // 데이터 포인트 업데이트

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
      pg.remove();
      cg.remove();
    };
  }, []);

  return (
    <div className="w-[600px] h-[800px] relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};
