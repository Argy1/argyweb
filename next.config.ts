import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    env: {
        APP_NAME: process.env.APP_NAME,
        BASE_URL: process.env.BASE_URL,
        API_URL: process.env.API_URL,
        DATABASE_URL: process.env.DATABASE_URL,
    }
}

export default nextConfig
