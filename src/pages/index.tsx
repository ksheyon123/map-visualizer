import dynamic from "next/dynamic";
import React from "react";
// Leaflet을 동적으로 임포트
const LeafletD3Map = dynamic<{ width: string; height: string }>(
  () => import("@/components/LeafLet").then((m) => m.LeafletD3Map),
  {
    ssr: false, // 서버사이드 렌더링 비활성화
  }
);
const Page = () => {
  return <LeafletD3Map width="600px" height="600px" />;
};
export default Page;
