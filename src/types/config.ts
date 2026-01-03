

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
	avatar?: string; // 新增：个人头像
	introBackground?: string; // 新增：个人介绍页背景图
	introDisplayDays?: number; // 新增：介绍页显示周期（天）
	introStyle?: {
		opacity: string;
		blur: string;
		theme?: 'light' | 'dark'; // 新增：内容主题色
	};
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
	tocWidth: string; 
	tocMaxDepth: number; 
	contentRailGap?: string; 
	tabletMaxWidth?: string; 
	tabletSidebarWidth?: string; 
	tabletSidebarExtendWidth?: string; 

	contentLeftMarginBase?: string; 
	contentLeftMarginTablet?: string; 

	// Live2D 配置
	live2d?: {
		enable: boolean;
	};
}

export interface NavBarConfig {
	links: {
		[key: string]: NavBarLink;
	};
}
export type ExpressiveCodeConfig = {
	themes: string[];
};
