import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { cloudflareEmail } from "@emdash-cms/cloudflare/plugins";
import icon from "astro-iconset";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";
import { formsPlugin } from "@emdash-cms/plugin-forms";

export default defineConfig({
	output: "server",
	// 旧WordPress版のURL → 新しいページ（2026-10 移行）
	redirects: {
		"/our-services": "/#services",
		"/our-story": "/#profile",
		"/contact-us": "/contact",
		"/global-styles": "/",
		"/author/kuchiumi": "/",
		"/feed": "/",
		"/comments/feed": "/",
	},
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	vite: {
		ssr: {
			optimizeDeps: {
				// Pre-bundle so it isn't discovered mid-render, which would trigger
				// a Vite dep re-optimization and break in-flight worker imports
				// under the Cloudflare dev runner (workerd).
				include: ["astro-iconset/components"],
			},
		},
	},
	integrations: [
		react(),
		icon({
			// Only ship the Phosphor icons actually referenced in templates,
			// not the full @iconify-json/ph set (which adds megabytes to the
			// deployed worker bundle).
			include: {
				ph: [
					"arrow-right",
					"bell-simple",
					"buildings",
					"chart-bar",
					"chat-circle",
					"check",
					"check-circle",
					"clock",
					"cloud",
					"code",
					"currency-dollar",
					"envelope",
					"file-text",
					"gauge",
					"globe",
					"heart",
					"leaf",
					"lifebuoy",
					"lightning",
					"list",
					"lock",
					"map-pin",
					"pause",
					"phone",
					"play",
					"plug",
					"plus",
					"shield-check",
					"sparkle",
					"star",
					"sun",
					"thermometer-simple",
					"trend-up",
					"users-three",
					"x",
				],
			},
		}),
		emdash({
			database: d1({ binding: "DB", session: "auto", coalesce: true }),
			storage: r2({ binding: "MEDIA" }),
			plugins: [
				formsPlugin({ defaultSpamProtection: "honeypot" }),
				// フォームの通知メール（Cloudflare Email Sending、送信元は sisemeri.com）
				cloudflareEmail({ from: { email: "noreply@sisemeri.com", name: "sisemeri" }, binding: "EMAIL" }),
			],
		}),
	],
	// 日本語サイトなので本文・見出しとも日本語書体（英数字も同じ書体で揃う）
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Noto Sans JP",
			cssVariable: "--font-body",
			weights: [400, 500, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "Noto Serif JP",
			cssVariable: "--font-display",
			weights: [500],
			styles: ["normal"],
			fallbacks: ["serif"],
		},
	],
	devToolbar: { enabled: false },
});
