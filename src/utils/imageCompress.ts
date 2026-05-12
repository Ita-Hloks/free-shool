export interface CompressOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxBytes: number;
}

export interface CompressResult {
  dataUrl: string;
  byteSize: number;
}

const DEFAULT_OPTIONS: CompressOptions = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.75,
  maxBytes: 700_000,
};

const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("图片读取失败"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
};

const getTargetSize = (width: number, height: number, maxWidth: number, maxHeight: number) => {
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
};

export const estimateDataUrlBytes = (dataUrl: string): number => {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.ceil((base64.length * 3) / 4);
};

export const compressImageFile = async (file: File, options?: Partial<CompressOptions>): Promise<CompressResult> => {
  if (!file.type.startsWith("image/")) {
    throw new Error("仅支持图片文件");
  }

  const merged = { ...DEFAULT_OPTIONS, ...options };
  const img = await loadImageFromFile(file);
  const target = getTargetSize(img.width, img.height, merged.maxWidth, merged.maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = target.width;
  canvas.height = target.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("图片处理失败");
  }

  ctx.drawImage(img, 0, 0, target.width, target.height);
  const dataUrl = canvas.toDataURL("image/jpeg", merged.quality);
  const byteSize = estimateDataUrlBytes(dataUrl);

  if (byteSize > merged.maxBytes) {
    throw new Error("图片过大，请换一张或裁剪后再上传");
  }

  return { dataUrl, byteSize };
};
