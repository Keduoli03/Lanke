

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
	contentRailGap?: string; // 新增：正文与右侧栏间距
	tabletMaxWidth?: string; // 新增：平板横屏最大宽度断点
	tabletSidebarWidth?: string; // 新增：平板横屏侧栏窄宽
	tabletSidebarExtendWidth?: string; // 新增：平板横屏侧栏展开宽度

	contentLeftMarginBase?: string; // 新增：主容器左外边距（桌面）
	contentLeftMarginTablet?: string; // 新增：主容器左外边距（平板横屏）
}

export interface NavBarConfig {
	links: {
		[key: string]: NavBarLink;
	};
}
export type ExpressiveCodeConfig = {
	themes: string[];
};
