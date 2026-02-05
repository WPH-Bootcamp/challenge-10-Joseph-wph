import type { NextConfig } from "next";
<<<<<<< HEAD

const nextConfig: NextConfig = {
  /* config options here */
=======
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
>>>>>>> 03cad95 (“challenge-10-joseph-wph-done”)
};

export default nextConfig;
