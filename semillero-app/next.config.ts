import type { NextConfig } from "next";

// Static export for GitHub Pages. This repo is served from
// https://<user>.github.io/semillero-robotica-prueba/ (a project page, not a
// user/org root page), so every asset and route needs the repo name as a
// base path — otherwise CSS/JS/fonts 404 once deployed.
const repoBasePath = "/semillero-robotica-prueba";

const nextConfig: NextConfig = {
  output: "export",
  basePath: repoBasePath,
  assetPrefix: repoBasePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
