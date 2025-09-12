import { LinkPresets } from "./constants/link-presets";
import type { NavBarConfig, SiteConfig } from "./types/config";

export const SITE_TITLE = 'Astro Blog';
export const SITE_DESCRIPTION = 'Welcome to my website!';

export const siteConfig: SiteConfig = {
  title: "Lanke",
  description: "Lanke's blog",
  // SEO和社交分享使用，可以用一样的
  image: {
    src: "/og.png",
    alt: "Lanke's blog",
  },
  logo: "./logo.png",
  themeColor: {
    hue: 250,
    fixed: false,
  },
  
  pageWidth: "82rem", // 内容区域最大宽度
  sidebarWidth: "4rem", // 侧边栏宽度，暂时没用，去src\layouts\MainLayout.astro自行修改
};

export const navBarConfig: NavBarConfig = {
  links: {
    home: {
      name: "首页",
      url: "/",
      icon: "material-symbols:home-outline-rounded",
    },
    blog: {
      name: "文章",
      url: "/posts",
      icon: "material-symbols:article-outline",
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