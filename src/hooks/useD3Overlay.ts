import { LinkFeature, NodeFeature } from "@/types/type.d3";
import { lngLatToLine } from "@/utils/d3Utils";
import { makeKey } from "@/utils";

export const useD3Overlay = () => {
  const setGroup = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    name = ""
  ) => {
    const g = svg.append("g").attr("class", name || makeKey(8));
    return g;
  };

  const drawLink = (
    map: L.Map,
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: LinkFeature[]
  ) => {
    const pathes = g.selectAll("path").data(data);
    pathes
      .enter()
      .append("path")
      .merge(pathes as any)
      .attr("d", (d: LinkFeature) => lngLatToLine(map, d))
      .attr("fill", "none")
      .attr("stroke", "#3498db")
      .attr("stroke-width", 2)
      .attr("class", "hover:opacity-80 transition-opacity");
    return pathes;
  };

  const drawNode = (
    map: L.Map,
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: NodeFeature[]
  ) => {
    const circles = g.selectAll("circle").data(data);
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
    return circles;
  };

  return {
    setGroup,
    drawLink,
    drawNode,
  };
};
