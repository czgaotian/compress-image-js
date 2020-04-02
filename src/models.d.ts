declare enum EImageType {
  "PNG" = "image/png",
  "JPEG" = "image/jpeg",
  "GIF" = "image/gif"
}

interface BaseConfig {
  [key: string]: any;
}

declare interface ImageToCanvasConfig extends BaseConfig {
  width?: number;
  height?: number;
  scale?: number;
  orientation?: number;
}

declare interface CompressConfig extends ImageToCanvasConfig {
  quality?: number;
  type?: EImageType;
  size?: number;
  minWidth?: number;
}
