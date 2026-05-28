import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // اگه تصاویر از CDN خارجی لود میشن، دامنه رو اینجا اضافه کن
    domains: ["cdn.qepal.com"],
  },
};

export default nextConfig;
