"use client";
import React from "react";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(
  () =>
    import("../../components/LeafLet").then((module) => module.LeafletD3Map),
  {
    ssr: false,
  }
);

const Page = () => {
  return <MapWithNoSSR />;
};

export default Page;
