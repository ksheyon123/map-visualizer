// next.config.js
const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["leaflet"],
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "map",
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./LeafLet": "./src/components/LeafLet",
        },
        shared: {},
        extraOptions: {
          exposePages: true,
          enableImageLoaderFix: true,
          enableUrlLoaderFix: true,
        },
      })
    );
    return config;
  },
};

module.exports = nextConfig;
