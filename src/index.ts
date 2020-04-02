import {
  checkImageType,
  blobToDataURL,
  canvasToDataURL,
  canvasToBlob,
  dataURLToImage,
  dataURLToBlob,
  imageToCanvas
} from "./utils";

/**
 * 压缩图片
 *
 * @param {(Blob|string)} img - File（Blob）对象或图像base64字符串
 * @param {object} config - 压缩配置
 * @return {Promise(Blob)}
 *
 */
export async function compress(
  img: Blob | string,
  config: CompressConfig
): Promise<Blob> {
  let dataURL: string;
  let file: Blob;
  if (img instanceof Blob) {
    file = img;
    dataURL = await blobToDataURL(img);
  } else if (img.startsWith("data:image")) {
    file = await dataURLToBlob(img);
    dataURL = img;
  } else {
    throw new Error(
      "The first argument must be a File or Blob object or a image base64 string."
    );
  }

  // 处理
  const originalMime = dataURL.split(",")[0].match(/:(.*?);/)[1] as EImageType; // 原始图像图片类型
  if (!checkImageType(originalMime))
    throw new Error(
      "The first argument must be a iamge File or Blob object or a image base64 string."
    );
  if (!checkImageType(config.type)) {
    config.type = originalMime;
  }

  const image = await dataURLToImage(dataURL);

  let compressDataURL: string;

  if (config.size) {
    // 压缩到指定大小
    let width = image.width;
    let quality = 1;
    const minWidth = config.minWidth || 200;
    const step =( width - minWidth) / 8;
    // blob.size与dataURL.length的比值约等于0.75
    // 为了提高性能，直接通过这个比值来估算出blob.size
    const proportion = 0.75;
    if (config.size * 1024 > file.size) {
      return file;
    }

    let width1 = width - step;
    while(width > 200) {
      compressDataURL = await compressCore(image, {
        width1,
        quality: config.quality,
        type: config.type,
      })
      if (compressDataURL.length * proportion < config.size) break;
      width1 -= step;
    }

    // 在指定图片格式为 image/jpeg 或 image/webp的情况下，可以设置图片质量
    



    compressDataURL = await compressCore(image, config);
  } else {
    // 不指定最大size
    compressDataURL = await compressCore(image, config);
  }
  const compressFile = await dataURLToBlob(compressDataURL, config.type);
  if (compressFile.size > file.size) {
    return file;
  }
  return compressFile;
}

// export async function compressUnderSize(
//   img: Blob | string,
//   size: number,
//   config: CompressConfig
// ) {
//   let dataURL: string;
//   let file: Blob;
//   if (img instanceof Blob) {
//     file = img;
//     dataURL = await blobToDataURL(img);
//   } else if (img.startsWith("data:image")) {
//     file = await dataURLToBlob(img);
//     dataURL = img;
//   } else {
//     throw new Error(
//       "The first argument must be a File or Blob object or a image base64 string."
//     );
//   }

//   let originalMime = dataURL.split(",")[0].match(/:(.*?);/)[1] as EImageType;
//   if (!checkImageType(originalMime))
//     throw new Error(
//       "The first argument must be a iamge File or Blob object or a image base64 string."
//     );

//   // 如果指定体积大于原文件体积，则不做处理；
//   if (size * 1024 > file.size) {
//     return file;
//   }

//   const image = await dataURLToImage(dataURL);
//   let scale = 1;
//   let quality = 1;
//   let compressDataURL;
//   let currentSize = file.size;
//   // blob.size与dataURL.length的比值约等于0.75
//   // 为了提高性能，直接通过这个比值来估算出blob.size
//   const proportion = 0.75;

//   while (currentSize > size) {
//     compressDataURL = await compressCore(image, {
//       scale,
//       quality,
//       type: originalMime
//     });
//     currentSize = compressDataURL.length * proportion;
//     scale -= 0.1;
//     if (!scale) throw new Error('');
//     quality -= 0.1;
//     if (!quality) throw new Error('');
//   }

//   const compressFile = await dataURLToBlob(compressDataURL, originalMime);
//   if (compressFile.size > file.size) {
//     return file;
//   }
//   return compressFile;
// }

async function compressCore(
  image: HTMLImageElement,
  config: CompressConfig
): Promise<string> {
  console.log(config.quality);
  const canvas = await imageToCanvas(image, config);
  const compressDataURL = await canvasToDataURL(
    canvas,
    config.quality,
    config.type
  );
  return compressDataURL;
}
