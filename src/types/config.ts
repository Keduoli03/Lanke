

export interface NavBarLink {
	name: string;
	url: string;
	external?: boolean;
	icon?: string;
}

export interface SiteConfig {
	title: string;
	description: string;
	url: string;
	favicon: string;
	logo: string;
	image: {
		src: string;
		alt: string;
	};
	themeColor: {
		hue: number;
		fixed: boolean;
	};
	pageWidth: string;
	sidebarWidth: string;
	sidebarExtendWidth: string;
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
