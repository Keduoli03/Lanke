declare module 'oh-my-live2d' {
  export type ModelOptions = {
    path: string;
    position?: [number, number];
    scale?: number;
    stageStyle?: { height?: number; width?: number };
  };

  export interface OML2D {
    loadNextModel(): void;
    loadNextModelClothes(): void;
    stageSlideOut(): void;
    stageSlideIn(): void;
    statusBarOpen(message?: string): void;
    statusBarClose(): void;
    setStatusBarClickEvent(handler: () => void): void;
    tipsMessage(message: string, duration?: number, level?: number): void;
    onStageSlideIn(cb: () => void): void;
    onStageSlideOut(cb: () => void): void;
  }

  export function loadOml2d(options: any): OML2D;
}

