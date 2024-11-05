import type {Config} from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: ({colors}) => ({

                ...colors,
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    '50': "#eff6ff",
                    '100': "#dbeafe",
                    '200': "#bfdbfe",
                    '300': "#93c5fd",
                    '400': "#60a5fa",
                    '500': "#3b82f6",
                    '600': "#2563eb",
                    '700': "#1d4ed8",
                    '800': "#1e40af",
                    '900': "#1e3a8a",
                    '950': "#172554"
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                    '50': "#faf5ff",
                    '100': "#f3e8ff",
                    '200': "#e9d5ff",
                    '300': "#d8b4fe",
                    '400': "#c084fc",
                    '500': "#a855f7",
                    '600': "#9333ea",
                    '700': "#7e22ce",
                    '800': "#6b21a8",
                    '900': "#581c87",
                    '950': "#3b0764"
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                    '50': "#f7fee7",
                    '100': "#ecfccb",
                    '200': "#d9f99d",
                    '300': "#bef264",
                    '400': "#a3e635",
                    '500': "#84cc16",
                    '600': "#65a30d",
                    '700': "#4d7c0f",
                    '800': "#3f6212",
                    '900': "#365314",
                    '950': "#1a2e05"
                },
                gray: {
                    '925': "",
                    '50': "#f8fafc",
                    '100': "#f1f5f9",
                    '200': "#e2e8f0",
                    '300': "#cbd5e1",
                    '400': "#94a3b8",
                    '500': "#64748b",
                    '600': "#475569",
                    '700': "#334155",
                    '800': "#1e293b",
                    '900': "#0f172a",
                    '950': "#020617"
                },
                danger: {
                    '50': "#fef2f2",
                    '100': "#fee2e2",
                    '200': "#fecaca",
                    '300': "#fca5a5",
                    '400': "#f87171",
                    '500': "#ef4444",
                    '600': "#dc2626",
                    '700': "#b91c1c",
                    '800': "#991b1b",
                    '900': "#7f1d1d",
                    '950': "#450a0a"
                },
                warning: {
                    '50': "#fefce8",
                    '100': "#fef9c3",
                    '200': "#fef08a",
                    '300': "#fde047",
                    '400': "#facc15",
                    '500': "#eab308",
                    '600': "#ca8a04",
                    '700': "#a16207",
                    '800': "#854d0e",
                    '900': "#713f12",
                    '950': "#422006"
                },
                success: {
                    '50': "#f0fdf4",
                    '100': "#dcfce7",
                    '200': "#bbf7d0",
                    '300': "#86efac",
                    '400': "#4ade80",
                    '500': "#22c55e",
                    '600': "#16a34a",
                    '700': "#15803d",
                    '800': "#166534",
                    '900': "#14532d",
                    '950': "#052e16"
                },
                info: {
                    '50': "#eff6ff",
                    '100': "#dbeafe",
                    '200': "#bfdbfe",
                    '300': "#93c5fd",
                    '400': "#60a5fa",
                    '500': "#3b82f6",
                    '600': "#2563eb",
                    '700': "#1d4ed8",
                    '800': "#1e40af",
                    '900': "#1e3a8a",
                    '950': "#172554"
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                /* primary: {
                     DEFAULT: 'hsl(var(--primary))',
                     foreground: 'hsl(var(--primary-foreground))'
                 },*/
                /*secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },*/
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                /* accent: {
                     DEFAULT: 'hsl(var(--accent))',
                     foreground: 'hsl(var(--accent-foreground))'
                 },*/
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                }
            }),
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            }
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [require("tailwindcss-animate")],
};
export default config;
