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
		fixed: boolean;
		hue: number;
	};
	pageWidth: string; // 改为必需
	sidebarWidth: string; // 改为必需
}

// 修改NavBarConfig接口，支持对象格式的links
export interface NavBarConfig {
	links: {
		[key: string]: NavBarLink;
	};
}