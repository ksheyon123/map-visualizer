import { LinkFeature } from "@/types/type.d3";
import * as d3 from "d3";
import L from "leaflet";

const lngLatToLine = (map: L.Map, d: LinkFeature) => {
  const coordinates = d.geometry.coordinates;
  const points = coordinates.map((coord) => {
    const point = map.latLngToLayerPoint([coord[1], coord[0]]);
    return `${point.x},${point.y}`;
  });
  return `M${points.join("L")}`;
};

const layoutContour = (map: L.Map, svg: any, pg: any, cg: any) => {
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

  pg.attr("transform", `translate(${-topLeft.x},${-topLeft.y})`);
  cg.attr("transform", `translate(${-topLeft.x},${-topLeft.y})`);
};

export { lngLatToLine, layoutContour };
