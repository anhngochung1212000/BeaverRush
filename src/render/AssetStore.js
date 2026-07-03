// render/AssetStore.js — load ảnh theo manifest (§A7.2).
// Manifest value: string (1 ảnh) HOẶC mảng string (anim nhiều frame — §C1, vd beaver_crawl).
// Lỗi load -> không đăng ký key -> drawSprite fallback graybox.
export class AssetStore {
  constructor() {
    this.images = new Map(); // key -> HTMLImageElement | HTMLImageElement[] (anim)
  }

  has(key) {
    return this.images.has(key);
  }

  async loadFromManifest(manifest) {
    const entries = Object.entries(manifest || {});
    // Dedupe theo path: nhiều key trỏ CÙNG file (vd bg_river/waterfall/ui_water_fill
    // cùng water.png) chỉ decode 1 HTMLImageElement — tiết kiệm RAM bitmap + patternCache
    const byPath = new Map(); // path -> Promise<Image|null>
    const loadOne = (path) => {
      if (!byPath.has(path)) {
        byPath.set(path, new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = path;
        }));
      }
      return byPath.get(path);
    };
    await Promise.all(
      entries.map(async ([key, value]) => {
        if (Array.isArray(value)) {
          const frames = (await Promise.all(value.map(loadOne))).filter(Boolean);
          if (frames.length) this.images.set(key, frames);
        } else {
          const img = await loadOne(value);
          if (img) this.images.set(key, img);
        }
      })
    );
  }
}
