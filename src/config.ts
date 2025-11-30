
import type { NavBarConfig, SiteConfig,ExpressiveCodeConfig } from "./types/config";
import type { AstroExpressiveCodeOptions } from 'astro-expressive-code';


export const siteConfig: SiteConfig = {
  title: "Lanke",
  description: "Lanke's blog",
  url: "https://blog.blueke.top",
  // SEO和社交分享使用，可以用一样的
  image: {
    src: "/og.png",
    alt: "Lanke's blog",
  },
  logo: "./logo.png",
  favicon: "/favicon-32.png",
  // 主题颜色配置，对于引用块有影响
  themeColor: {
    hue: 210,
    fixed: false,
  },
  
  pageWidth: "60rem", // 内容区域最大宽度
  sidebarWidth: "4rem", // 侧边栏默认宽度
  sidebarExtendWidth: "8rem", // 侧边栏展开宽度
  tocWidth: "12rem", // 目录宽度 (224px)
  tocMaxDepth: 3, // 目录最大显示深度
  // 新增：全局变量便于统一管理
  contentRailGap: "1.5rem", // 正文与右侧栏间距
  tabletMaxWidth: "1440px", // 平板横屏最大宽度断点
  tabletSidebarWidth: "2rem", // 平板横屏侧栏窄宽
  tabletSidebarExtendWidth: "8rem", // 平板横屏侧栏展开宽度
  
  contentLeftMarginBase: "-2rem", // 主容器左外边距（桌面）
  contentLeftMarginTablet: "-3rem", // 主容器左外边距（平板横屏）

  // Live2D 开关
  live2d: {
    enable: true,
  },
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
    columns: {
      name: "专栏",
      url: "/columns",
      icon: "material-symbols:view-list-outline-rounded",
    },
    friends: {
      name: "友链",
      url: "/friends",
      icon: "material-symbols:group-outline-rounded",
    },
    bangumi: {
      name: "番剧",
      url: "/bangumi",
      icon:"material-symbols:movie-outline-rounded",
    },
    memos: {
      name: "说说",
      url: "/memos",
      icon: "material-symbols:chat-outline",
    },
    about: {
      name: "关于",
      url: "/about",
      icon: "material-symbols:person-outline",
    },
    traveling: {
      name: "开往",
      url: "https://www.travellings.cn/typewriter.html",
      icon: "material-symbols:train-outline",
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
