
import type { NavBarConfig, SiteConfig,ExpressiveCodeConfig } from "./types/config";
import type { AstroExpressiveCodeOptions } from 'astro-expressive-code';


export const siteConfig: SiteConfig = {
  title: "Lanke",
  description: "Lanke's blog",
  url: "http://localhost:4321",
  // SEO和社交分享使用，可以用一样的
  image: {
    src: "/og.png",
    alt: "Lanke's blog",
  },
  logo: "./logo.png",
  // 主题颜色配置，对于引用块有影响
  themeColor: {
    hue: 210,
    fixed: false,
  },
  
  pageWidth: "80rem", // 内容区域最大宽度
  sidebarWidth: "4rem", // 侧边栏宽度
  tocWidth: "12rem", // 目录宽度 (224px)
  tocMaxDepth: 3, // 目录最大显示深度
};

export const navBarConfig: NavBarConfig = {
  links: {
    home: {
      name: "首页",
      url: "/",
      icon: "material-symbols:home-outline-rounded",
    },
    blog: {
      name: "归档",
      url: "/archive",
      icon: "material-symbols:article-outline",
    },
    friends: {
      name: "友链",
      url: "/friends",
      icon: "material-symbols:group-outline-rounded",
    },
    about: {
      name: "关于",
      url: "/about",
      icon: "material-symbols:person-outline",
    },
    
  },
};

// 首页文章数量
export const PAGE_SIZE = 6;

// 代码块配置
//由于内联脚本无法使用变量，所以修改完此处需要手动去src\utils\theme-script.ts修改代码块样式
export const expressiveCodeConfig: AstroExpressiveCodeOptions = {
	themes: ["light-plus", "catppuccin-frappe"],
};
