import type { LinkPresets } from "../constants/link-presets";

export type LinkPreset = (typeof LinkPresets)[keyof typeof LinkPresets];

export interface NavBarLink {
	name: string;
	url: string;
	external?: boolean;
	icon?: string;
}

export interface SiteConfig {
	title: string;
	description: string;
	image: {
		src: string;
		alt: string;
	};
	logo: string;
	themeColor: {
		hue: number;
		fixed: boolean;
	};
	pageWidth: string;
	sidebarWidth: string;
	tocWidth: string; // 新增：目录宽度
	tocMaxDepth: number; // 新增：目录最大深度
}

export interface NavBarConfig {
	links: {
		[key: string]: NavBarLink;
	};
}
export type ExpressiveCodeConfig = {
	themes: string[];
};
