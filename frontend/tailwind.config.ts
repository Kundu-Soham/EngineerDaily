import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Include prefixed paths to account for your monorepo folder structure
    "./frontend/src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/src/app/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Keep these just in case Vercel builds relative to the frontend directory root
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;