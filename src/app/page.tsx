"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import node from "@/constants/NODE.json";
import link from "@/constants/LINK.json";

const Page = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // SVG 요소 초기화
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 800;

    // 메인 그룹 생성 (줌 적용을 위한 컨테이너)
    const g = svg.append("g");

    // 줌 동작 정의
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 5]) // 줌 범위 설정 (0.5배 ~ 5배)
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    // SVG에 줌 동작 적용
    svg.call(zoom as any);

    // 툴팁 그룹 생성
    const tooltip = g
      .append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    // 툴팁 배경 직사각형
    tooltip
      .append("rect")
      .attr("class", "tooltip-bg")
      .attr("fill", "white")
      .attr("stroke", "#ccc")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("opacity", 0.9);

    // 툴팁 텍스트
    const tooltipText = tooltip
      .append("text")
      .attr("font-size", "12px")
      .attr("fill", "#333");

    const xExtent = d3.extent(
      node.features,
      (d) => d.geometry.coordinates[0]
    ) as [number, number];
    const yExtent = d3.extent(
      node.features,
      (d) => d.geometry.coordinates[1]
    ) as [number, number];

    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0] - 10000, xExtent[1] + 10000])
      .range([50, width - 50]);

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - 10000, yExtent[1] + 10000])
      .range([height - 50, 50]);

    const lineGenerator = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    function showTooltip(event: MouseEvent, d: any) {
      const tooltipPadding = { x: 8, y: 4 };

      // 툴팁 텍스트 업데이트
      tooltipText.selectAll("*").remove();
      tooltipText
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "1.2em")
        .attr("font-weight", "bold")
        .text(d.properties?.name || "Node");

      tooltipText
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "1.2em")
        .text(d.properties?.description || "No description");

      // 텍스트 크기에 따라 배경 크기 조정
      const bbox = tooltipText.node()?.getBBox();
      if (bbox) {
        tooltip
          .select("rect")
          .attr("width", bbox.width + tooltipPadding.x * 2)
          .attr("height", bbox.height + tooltipPadding.y * 2);

        tooltipText.attr(
          "transform",
          `translate(${tooltipPadding.x}, ${tooltipPadding.y})`
        );
      }

      // 툴팁 위치 설정 (줌 transform 고려)
      const x = xScale(d.geometry.coordinates[0]);
      const y = yScale(d.geometry.coordinates[1]);
      tooltip
        .attr("transform", `translate(${x + 10}, ${y - 10})`)
        .style("display", null);
    }

    function hideTooltip() {
      tooltip.style("display", "none");
    }

    function createObject(d: any) {
      const x = xScale(d.geometry.coordinates[0]);
      const y = yScale(d.geometry.coordinates[1]);
      return g
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 3)
        .attr("fill", "#e74c3c")
        .attr("stroke", "#c0392b")
        .attr("class", "hover:opacity-80 cursor-pointer transition-opacity")
        .on("mouseover", (event) => showTooltip(event, d))
        .on("mouseout", hideTooltip);
    }

    const createPath = (feature: any) => {
      const coordinates = feature.geometry.coordinates;

      g.append("path")
        .datum(coordinates)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "#3498db")
        .attr("stroke-width", 2)
        .attr("class", "hover:opacity-80 transition-opacity")
        .on("mouseover", function (event) {
          d3.select(this).attr("stroke-width", 4).attr("stroke", "#2980b9");
        });
    };

    // 링크를 먼저 그립니다
    link.features.forEach((feature) => {
      createPath(feature);
    });

    // 그 다음 노드를 그려서 위에 표시되도록 합니다
    node.features.forEach((feature) => {
      createObject(feature);
    });

    // 줌 컨트롤 버튼 추가
    const zoomControls = svg
      .append("g")
      .attr("class", "zoom-controls")
      .attr("transform", `translate(${width - 70}, 20)`);

    // 줌 인 버튼
    zoomControls
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 24)
      .attr("height", 24)
      .attr("fill", "white")
      .attr("stroke", "#ccc")
      .attr("rx", 4)
      .attr("class", "cursor-pointer")
      .on("click", () => {
        svg
          .transition()
          .duration(300)
          .call(zoom.scaleBy as any, 1.3);
      });

    zoomControls
      .append("text")
      .attr("x", 12)
      .attr("y", 16)
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .text("+")
      .attr("class", "cursor-pointer select-none")
      .on("click", () => {
        svg
          .transition()
          .duration(300)
          .call(zoom.scaleBy as any, 1.3);
      });

    // 줌 아웃 버튼
    zoomControls
      .append("rect")
      .attr("x", 0)
      .attr("y", 30)
      .attr("width", 24)
      .attr("height", 24)
      .attr("fill", "white")
      .attr("stroke", "#ccc")
      .attr("rx", 4)
      .attr("class", "cursor-pointer")
      .on("click", () => {
        svg
          .transition()
          .duration(300)
          .call(zoom.scaleBy as any, 0.7);
      });

    zoomControls
      .append("text")
      .attr("x", 12)
      .attr("y", 46)
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .text("-")
      .attr("class", "cursor-pointer select-none")
      .on("click", () => {
        svg
          .transition()
          .duration(300)
          .call(zoom.scaleBy as any, 0.7);
      });

    // 리셋 버튼
    zoomControls
      .append("rect")
      .attr("x", 0)
      .attr("y", 60)
      .attr("width", 24)
      .attr("height", 24)
      .attr("fill", "white")
      .attr("stroke", "#ccc")
      .attr("rx", 4)
      .attr("class", "cursor-pointer")
      .on("click", () => {
        svg
          .transition()
          .duration(300)
          .call(zoom.transform as any, d3.zoomIdentity);
      });

    zoomControls
      .append("text")
      .attr("x", 12)
      .attr("y", 76)
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .style("font-size", "10px")
      .text("R")
      .attr("class", "cursor-pointer select-none")
      .on("click", () => {
        svg
          .transition()
          .duration(300)
          .call(zoom.transform as any, d3.zoomIdentity);
      });

    return () => {
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <svg
        ref={svgRef}
        width="600"
        height="800"
        className="border border-gray-200 rounded"
        viewBox="0 0 600 800"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default Page;
