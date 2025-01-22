import * as d3 from "d3";
import { useRef } from "react";

export const useD3 = () => {
  const createD3Canvas = (ref: any, width: number, height: number) => {
    const svg = d3
      .select(ref)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    return svg;
  };

  const setProjection = (width: number, height: number) => {
    // 투영법 설정
    const projection = d3
      .geoMercator()
      .center([128, 36])
      .scale(4000)
      .translate([width / 2, height / 2]);

    // 지도 경로 생성기
    const path = d3.geoPath().projection(projection);
    return path;
  };
  return {
    createD3Canvas,
    setProjection,
  };
};
