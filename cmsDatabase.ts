import {
  Project,
  ProjectCategoryItem,
  ServiceItem,
  BrandClient,
  Testimonial,
  Inquiry,
  HeroConfig,
  NavigationMenuItem,
  WebsiteSection,
  SiteSettings,
  StudioProfile,
  AdminUser,
  MediaAsset
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_CATEGORIES,
  INITIAL_HERO_CONFIG,
  SERVICES_LIST,
  INITIAL_BRANDS,
  INITIAL_TESTIMONIALS,
  INITIAL_INQUIRIES,
  INITIAL_STUDIO_PROFILE,
  INITIAL_NAVIGATION,
  INITIAL_SECTIONS,
  INITIAL_SITE_SETTINGS,
  INITIAL_ADMIN
} from '../data/initialData';

const DB_NAME = 'StudioCMS_DB_v2';
const DB_VERSION = 2;

// IndexedDB instance cache
let dbPromise: Promise<IDBDatabase> | null = null;

export function openCmsDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Single-record content store (settings, hero, profile, nav, sections, auth, draft)
      if (!db.objectStoreNames.contains('cms_content')) {
        db.createObjectStore('cms_content', { keyPath: 'key' });
      }

      // Projects
      if (!db.objectStoreNames.contains('projects')) {
        const store = db.createObjectStore('projects', { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('order', 'order', { unique: false });
        store.createIndex('visible', 'visible', { unique: false });
      }

      // Categories
      if (!db.objectStoreNames.contains('categories')) {
        const store = db.createObjectStore('categories', { keyPath: 'id' });
        store.createIndex('order', 'order', { unique: false });
      }

      // Services
      if (!db.objectStoreNames.contains('services')) {
        const store = db.createObjectStore('services', { keyPath: 'id' });
        store.createIndex('order', 'order', { unique: false });
      }

      // Brands / Clients
      if (!db.objectStoreNames.contains('brands')) {
        const store = db.createObjectStore('brands', { keyPath: 'id' });
        store.createIndex('order', 'order', { unique: false });
      }

      // Testimonials
      if (!db.objectStoreNames.contains('testimonials')) {
        const store = db.createObjectStore('testimonials', { keyPath: 'id' });
        store.createIndex('order', 'order', { unique: false });
      }

      // Inquiries
      if (!db.objectStoreNames.contains('inquiries')) {
        const store = db.createObjectStore('inquiries', { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }

      // Media Assets Library
      if (!db.objectStoreNames.contains('media_library')) {
        const store = db.createObjectStore('media_library', { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('uploadDate', 'uploadDate', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

// Generic transaction helpers
async function getStore(storeName: string, mode: IDBTransactionMode = 'readonly') {
  const db = await openCmsDatabase();
  const tx = db.transaction(storeName, mode);
  return { tx, store: tx.objectStore(storeName) };
}

export async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  try {
    const { store } = await getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`Error reading ${storeName} from IndexedDB:`, err);
    return [];
  }
}

export async function putItem<T>(storeName: string, item: T): Promise<void> {
  const { store } = await getStore(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteItem(storeName: string, id: string): Promise<void> {
  const { store } = await getStore(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearStore(storeName: string): Promise<void> {
  const { store } = await getStore(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Content singleton helper
export async function getContentSingleton<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const { store } = await getStore('cms_content', 'readonly');
    return new Promise((resolve) => {
      const request = store.get(key);
      request.onsuccess = () => {
        if (request.result && request.result.data !== undefined) {
          resolve(request.result.data);
        } else {
          resolve(defaultValue);
        }
      };
      request.onerror = () => resolve(defaultValue);
    });
  } catch {
    return defaultValue;
  }
}

export async function setContentSingleton<T>(key: string, data: T): Promise<void> {
  const { store } = await getStore('cms_content', 'readwrite');
  return new Promise((resolve, reject) => {
    const request = store.put({ key, data, updatedAt: new Date().toISOString() });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Initialize and Seed Database if first launch
export async function initializeDatabase(): Promise<boolean> {
  try {
    const isSeeded = await getContentSingleton('is_db_seeded', false);
    if (!isSeeded) {
      console.log('Seeding Studio CMS Database for the first time...');

      // Seed projects
      for (const p of INITIAL_PROJECTS) {
        await putItem('projects', p);
      }

      // Seed categories
      for (const c of INITIAL_CATEGORIES) {
        await putItem('categories', c);
      }

      // Seed services
      for (const s of SERVICES_LIST) {
        await putItem('services', s);
      }

      // Seed brands
      for (const b of INITIAL_BRANDS) {
        await putItem('brands', b);
      }

      // Seed testimonials
      for (const t of INITIAL_TESTIMONIALS) {
        await putItem('testimonials', t);
      }

      // Seed inquiries
      for (const inq of INITIAL_INQUIRIES) {
        await putItem('inquiries', inq);
      }

      // Seed singletons
      await setContentSingleton('hero_config', INITIAL_HERO_CONFIG);
      await setContentSingleton('studio_profile', INITIAL_STUDIO_PROFILE);
      await setContentSingleton('navigation', INITIAL_NAVIGATION);
      await setContentSingleton('sections', INITIAL_SECTIONS);
      await setContentSingleton('site_settings', INITIAL_SITE_SETTINGS);
      await setContentSingleton('admin_auth', INITIAL_ADMIN);

      // Seed initial media assets from local hero and projects
      const initialMediaList: MediaAsset[] = [
        {
          id: 'media-hero-portrait',
          name: 'hero_designer_portrait.jpg',
          type: 'image',
          mimeType: 'image/jpeg',
          size: 245000,
          dataUrl: '/src/assets/images/hero_designer_portrait_1793179168215.jpg',
          uploadDate: '2026-10-25'
        },
        {
          id: 'media-brand-axon',
          name: 'project_brand_identity.jpg',
          type: 'image',
          mimeType: 'image/jpeg',
          size: 310000,
          dataUrl: '/src/assets/images/project_brand_identity_1793179169105.jpg',
          uploadDate: '2026-10-25'
        },
        {
          id: 'media-pkg-boxes',
          name: 'project_packaging_boxes.jpg',
          type: 'image',
          mimeType: 'image/jpeg',
          size: 290000,
          dataUrl: '/src/assets/images/project_packaging_boxes_1793179168555.jpg',
          uploadDate: '2026-10-25'
        },
        {
          id: 'media-editorial',
          name: 'project_editorial_magazine.jpg',
          type: 'image',
          mimeType: 'image/jpeg',
          size: 340000,
          dataUrl: '/src/assets/images/project_editorial_magazine_1793179170586.jpg',
          uploadDate: '2026-10-25'
        },
        {
          id: 'media-luxury-bag',
          name: 'project_luxury_shopping_bag.jpg',
          type: 'image',
          mimeType: 'image/jpeg',
          size: 280000,
          dataUrl: '/src/assets/images/project_luxury_shopping_bag_1793179170621.jpg',
          uploadDate: '2026-10-25'
        }
      ];

      for (const m of initialMediaList) {
        await putItem('media_library', m);
      }

      await setContentSingleton('is_db_seeded', true);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to initialize Studio CMS database:', err);
    return false;
  }
}

// Image Compression & Optimization Utility
export async function optimizeAndStoreMedia(
  file: File,
  onProgress?: (progress: number) => void
): Promise<MediaAsset> {
  const isVideo = file.type.startsWith('video/');
  const id = `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  onProgress?.(20);

  if (isVideo) {
    // Process video file: convert to dataUrl / Blob URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const p = Math.round(20 + (e.loaded / e.total) * 70);
          onProgress?.(p);
        }
      };
      reader.onload = async () => {
        onProgress?.(95);
        const asset: MediaAsset = {
          id,
          name: file.name,
          type: 'video',
          mimeType: file.type || 'video/mp4',
          size: file.size,
          dataUrl: reader.result as string,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        await putItem('media_library', asset);
        onProgress?.(100);
        resolve(asset);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  // For images: optimize and compress using HTML5 Canvas
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onProgress?.(40);
      const img = new Image();
      img.onload = async () => {
        onProgress?.(65);
        const MAX_WIDTH = 2200;
        const MAX_HEIGHT = 2200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        onProgress?.(85);
        // Format to WebP if supported, fallback to JPEG
        let dataUrl = canvas.toDataURL('image/webp', 0.88);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        }

        const approximateSize = Math.round((dataUrl.length * 3) / 4);

        const asset: MediaAsset = {
          id,
          name: file.name,
          type: 'image',
          mimeType: dataUrl.startsWith('data:image/webp') ? 'image/webp' : 'image/jpeg',
          size: approximateSize,
          dataUrl,
          uploadDate: new Date().toISOString().split('T')[0],
          width,
          height
        };

        await putItem('media_library', asset);
        onProgress?.(100);
        resolve(asset);
      };
      img.onerror = () => reject(new Error('Failed to load image for optimization'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Media Usage Checker: Finds every place an image/video is used
export async function checkMediaUsage(mediaUrl: string, mediaName?: string): Promise<string[]> {
  const usages: string[] = [];

  try {
    // 1. Check Hero Slides
    const hero = await getContentSingleton<HeroConfig>('hero_config', INITIAL_HERO_CONFIG);
    hero.images.forEach((slide, idx) => {
      if (slide.url === mediaUrl || (mediaName && slide.url.includes(mediaName))) {
        usages.push(`Hero Banner (Slide #${idx + 1}: ${slide.title || 'Untitled'})`);
      }
    });

    // 2. Check Projects
    const projects = await getAllFromStore<Project>('projects');
    projects.forEach((p) => {
      if (p.image === mediaUrl || (mediaName && p.image.includes(mediaName))) {
        usages.push(`Project Main Image: "${p.title}"`);
      }
      p.galleryImages?.forEach((galUrl, gIdx) => {
        if (galUrl === mediaUrl || (mediaName && galUrl.includes(mediaName))) {
          usages.push(`Project Gallery #${gIdx + 1}: "${p.title}"`);
        }
      });
    });

    // 3. Check Services
    const services = await getAllFromStore<ServiceItem>('services');
    services.forEach((s) => {
      if (s.image === mediaUrl) {
        usages.push(`Service Graphic: "${s.title}"`);
      }
    });

    // 4. Check Brands / Clients
    const brands = await getAllFromStore<BrandClient>('brands');
    brands.forEach((b) => {
      if (b.logo === mediaUrl || (mediaName && b.logo.includes(mediaName))) {
        usages.push(`Client Logo: "${b.name}"`);
      }
    });

    // 5. Check Site Settings (Logo, Favicon)
    const settings = await getContentSingleton<SiteSettings>('site_settings', INITIAL_SITE_SETTINGS);
    if (settings.logoUrl === mediaUrl) {
      usages.push('Website Navbar Logo');
    }
    if (settings.faviconUrl === mediaUrl) {
      usages.push('Website Favicon');
    }
  } catch (err) {
    console.error('Error scanning media usage:', err);
  }

  return usages;
}

// Database Export & Import
export async function exportDatabaseBackup(): Promise<string> {
  const [
    projects,
    categories,
    services,
    brands,
    testimonials,
    inquiries,
    mediaLibrary,
    heroConfig,
    studioProfile,
    navigation,
    sections,
    siteSettings
  ] = await Promise.all([
    getAllFromStore('projects'),
    getAllFromStore('categories'),
    getAllFromStore('services'),
    getAllFromStore('brands'),
    getAllFromStore('testimonials'),
    getAllFromStore('inquiries'),
    getAllFromStore('media_library'),
    getContentSingleton('hero_config', INITIAL_HERO_CONFIG),
    getContentSingleton('studio_profile', INITIAL_STUDIO_PROFILE),
    getContentSingleton('navigation', INITIAL_NAVIGATION),
    getContentSingleton('sections', INITIAL_SECTIONS),
    getContentSingleton('site_settings', INITIAL_SITE_SETTINGS)
  ]);

  const backup = {
    exportedAt: new Date().toISOString(),
    version: DB_VERSION,
    data: {
      projects,
      categories,
      services,
      brands,
      testimonials,
      inquiries,
      mediaLibrary,
      heroConfig,
      studioProfile,
      navigation,
      sections,
      siteSettings
    }
  };

  return JSON.stringify(backup, null, 2);
}

export async function importDatabaseBackup(jsonString: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.data) {
      throw new Error('Invalid backup file format');
    }

    const {
      projects,
      categories,
      services,
      brands,
      testimonials,
      inquiries,
      mediaLibrary,
      heroConfig,
      studioProfile,
      navigation,
      sections,
      siteSettings
    } = parsed.data;

    // Clear stores
    await clearStore('projects');
    await clearStore('categories');
    await clearStore('services');
    await clearStore('brands');
    await clearStore('testimonials');
    await clearStore('inquiries');
    if (mediaLibrary && Array.isArray(mediaLibrary)) {
      await clearStore('media_library');
      for (const m of mediaLibrary) await putItem('media_library', m);
    }

    // Populate stores
    if (Array.isArray(projects)) for (const p of projects) await putItem('projects', p);
    if (Array.isArray(categories)) for (const c of categories) await putItem('categories', c);
    if (Array.isArray(services)) for (const s of services) await putItem('services', s);
    if (Array.isArray(brands)) for (const b of brands) await putItem('brands', b);
    if (Array.isArray(testimonials)) for (const t of testimonials) await putItem('testimonials', t);
    if (Array.isArray(inquiries)) for (const inq of inquiries) await putItem('inquiries', inq);

    // Save singletons
    if (heroConfig) await setContentSingleton('hero_config', heroConfig);
    if (studioProfile) await setContentSingleton('studio_profile', studioProfile);
    if (navigation) await setContentSingleton('navigation', navigation);
    if (sections) await setContentSingleton('sections', sections);
    if (siteSettings) await setContentSingleton('site_settings', siteSettings);

    return true;
  } catch (err) {
    console.error('Failed to import database backup:', err);
    throw err;
  }
}

// Database stats
export async function getDatabaseStats(): Promise<{
  projectsCount: number;
  categoriesCount: number;
  servicesCount: number;
  brandsCount: number;
  mediaCount: number;
  inquiriesCount: number;
  totalSizeApprox: string;
}> {
  const [projects, categories, services, brands, media, inq] = await Promise.all([
    getAllFromStore('projects'),
    getAllFromStore('categories'),
    getAllFromStore('services'),
    getAllFromStore('brands'),
    getAllFromStore<MediaAsset>('media_library'),
    getAllFromStore('inquiries')
  ]);

  const totalBytes = media.reduce((acc, m) => acc + (m.size || 0), 0);
  const sizeMb = (totalBytes / (1024 * 1024)).toFixed(2);

  return {
    projectsCount: projects.length,
    categoriesCount: categories.length,
    servicesCount: services.length,
    brandsCount: brands.length,
    mediaCount: media.length,
    inquiriesCount: inq.length,
    totalSizeApprox: `${sizeMb} MB`
  };
}
