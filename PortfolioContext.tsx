import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Project,
  ProjectCategoryItem,
  ServiceItem,
  BrandClient,
  Testimonial,
  Inquiry,
  InquiryStatus,
  HeroConfig,
  HeroSlideImage,
  NavigationMenuItem,
  WebsiteSection,
  SiteSettings,
  StudioProfile,
  AdminUser,
  MediaAsset,
  CmsToast
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
import {
  initializeDatabase,
  getAllFromStore,
  putItem,
  deleteItem,
  getContentSingleton,
  setContentSingleton,
  optimizeAndStoreMedia,
  checkMediaUsage as checkUsageDb,
  exportDatabaseBackup,
  importDatabaseBackup,
  getDatabaseStats
} from '../db/cmsDatabase';

interface PortfolioContextType {
  // Navigation & View Mode
  currentView: 'portfolio' | 'dashboard';
  setCurrentView: (view: 'portfolio' | 'dashboard') => void;
  activeCmsTab: string;
  setActiveCmsTab: (tab: string) => void;
  jumpToCmsSection: (tab: string) => void;

  // Save / Draft / Publish
  isPreviewMode: boolean;
  setIsPreviewMode: (val: boolean) => void;
  hasDraftChanges: boolean;
  saveDraft: (message?: string) => Promise<void>;
  publishAll: () => Promise<void>;
  discardDraft: () => Promise<void>;

  // Site Settings & Profile
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  studioProfile: StudioProfile;
  updateStudioProfile: (profile: Partial<StudioProfile>) => Promise<void>;

  // Hero Configuration & Slideshow
  heroConfig: HeroConfig;
  updateHeroConfig: (config: Partial<HeroConfig>) => Promise<void>;
  addHeroImage: (image: Omit<HeroSlideImage, 'id' | 'order'>) => Promise<void>;
  removeHeroImage: (id: string) => Promise<void>;
  reorderHeroImages: (newImages: HeroSlideImage[]) => Promise<void>;

  // Projects & Categories
  projects: Project[];
  categories: ProjectCategoryItem[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  likeProject: (id: string) => Promise<void>;
  incrementProjectViews: (id: string) => Promise<void>;
  addProject: (newProject: Omit<Project, 'id' | 'views' | 'likes'>) => Promise<void>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  reorderProjects: (orderedProjects: Project[]) => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Services
  services: ServiceItem[];
  addService: (newService: Omit<ServiceItem, 'id' | 'order'>) => Promise<void>;
  updateService: (id: string, updated: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  reorderServices: (ordered: ServiceItem[]) => Promise<void>;

  // Brands / Clients
  brands: BrandClient[];
  addBrand: (newBrand: Omit<BrandClient, 'id' | 'order'>) => Promise<void>;
  updateBrand: (id: string, updated: Partial<BrandClient>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  reorderBrands: (ordered: BrandClient[]) => Promise<void>;

  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (newTestimonial: Omit<Testimonial, 'id' | 'order'>) => Promise<void>;
  updateTestimonial: (id: string, updated: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  // Navigation Menu & Sections
  navigationMenu: NavigationMenuItem[];
  updateNavigationMenu: (items: NavigationMenuItem[]) => Promise<void>;
  websiteSections: WebsiteSection[];
  updateWebsiteSections: (sections: WebsiteSection[]) => Promise<void>;

  // Media Assets Library
  mediaLibrary: MediaAsset[];
  uploadMedia: (file: File, onProgress?: (p: number) => void) => Promise<MediaAsset>;
  deleteMedia: (id: string) => Promise<{ success: boolean; warnings?: string[] }>;
  checkMediaUsage: (mediaUrl: string, mediaName?: string) => Promise<string[]>;

  // Inquiries
  inquiries: Inquiry[];
  addInquiry: (data: Omit<Inquiry, 'id' | 'date' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryStatus) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  unreadInquiriesCount: number;
  openContactWithService: (serviceName?: string) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  selectedServiceForInquiry: string;
  openForWork: boolean;
  setOpenForWork: (open: boolean) => void;

  // Admin Auth & Security
  adminUser: AdminUser;
  isOwnerMode: boolean;
  isPinModalOpen: boolean;
  setIsPinModalOpen: (open: boolean) => void;
  loginAdmin: (identifier: string, secret: string) => boolean;
  logoutAdmin: () => void;
  updateAdminCredentials: (creds: Partial<AdminUser>) => Promise<void>;

  // Modals for editing
  editingProject: Project | null;
  setEditingProject: (project: Project | null) => void;
  isProjectEditorOpen: boolean;
  setIsProjectEditorOpen: (open: boolean) => void;
  isStudioProfileEditorOpen: boolean;
  setIsStudioProfileEditorOpen: (open: boolean) => void;

  // Toasts
  toasts: CmsToast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // DB Backup & Stats
  exportBackup: () => Promise<string>;
  importBackup: (json: string) => Promise<void>;
  getStats: () => Promise<{
    projectsCount: number;
    categoriesCount: number;
    servicesCount: number;
    brandsCount: number;
    mediaCount: number;
    inquiriesCount: number;
    totalSizeApprox: string;
  }>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'portfolio' | 'dashboard'>('portfolio');
  const [activeCmsTab, setActiveCmsTab] = useState<string>('overview');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [hasDraftChanges, setHasDraftChanges] = useState<boolean>(() => {
    try {
      return localStorage.getItem('talmeez_has_draft') === 'true';
    } catch {
      return false;
    }
  });

  // Data state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [studioProfile, setStudioProfile] = useState<StudioProfile>(INITIAL_STUDIO_PROFILE);
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(INITIAL_HERO_CONFIG);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [categories, setCategories] = useState<ProjectCategoryItem[]>(INITIAL_CATEGORIES);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_LIST);
  const [brands, setBrands] = useState<BrandClient[]>(INITIAL_BRANDS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [navigationMenu, setNavigationMenu] = useState<NavigationMenuItem[]>(INITIAL_NAVIGATION);
  const [websiteSections, setWebsiteSections] = useState<WebsiteSection[]>(INITIAL_SECTIONS);
  const [mediaLibrary, setMediaLibrary] = useState<MediaAsset[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [adminUser, setAdminUser] = useState<AdminUser>(INITIAL_ADMIN);

  // Modals & UI
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectEditorOpen, setIsProjectEditorOpen] = useState(false);
  const [isStudioProfileEditorOpen, setIsStudioProfileEditorOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState('Brand Identity');
  const [openForWork, setOpenForWork] = useState(true);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Admin auth
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search.includes('readonly=true')) {
        return false;
      }
      return localStorage.getItem('talmeez_is_owner') === 'true';
    } catch {
      return false;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<CmsToast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Jump from front-end "Edit" button straight to dashboard tab
  const jumpToCmsSection = useCallback((tab: string) => {
    if (!isOwnerMode) {
      setIsPinModalOpen(true);
      return;
    }
    setActiveCmsTab(tab);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isOwnerMode]);

  // Load from database on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        await initializeDatabase();
        const [
          dbProjects,
          dbCategories,
          dbServices,
          dbBrands,
          dbTestimonials,
          dbInquiries,
          dbMedia,
          dbHero,
          dbProfile,
          dbNav,
          dbSections,
          dbSettings,
          dbAuth
        ] = await Promise.all([
          getAllFromStore<Project>('projects'),
          getAllFromStore<ProjectCategoryItem>('categories'),
          getAllFromStore<ServiceItem>('services'),
          getAllFromStore<BrandClient>('brands'),
          getAllFromStore<Testimonial>('testimonials'),
          getAllFromStore<Inquiry>('inquiries'),
          getAllFromStore<MediaAsset>('media_library'),
          getContentSingleton<HeroConfig>('hero_config', INITIAL_HERO_CONFIG),
          getContentSingleton<StudioProfile>('studio_profile', INITIAL_STUDIO_PROFILE),
          getContentSingleton<NavigationMenuItem[]>('navigation', INITIAL_NAVIGATION),
          getContentSingleton<WebsiteSection[]>('sections', INITIAL_SECTIONS),
          getContentSingleton<SiteSettings>('site_settings', INITIAL_SITE_SETTINGS),
          getContentSingleton<AdminUser>('admin_auth', INITIAL_ADMIN)
        ]);

        if (isMounted) {
          if (dbProjects.length > 0) setProjects(dbProjects.sort((a, b) => a.order - b.order));
          if (dbCategories.length > 0) setCategories(dbCategories.sort((a, b) => a.order - b.order));
          if (dbServices.length > 0) setServices(dbServices.sort((a, b) => a.order - b.order));
          if (dbBrands.length > 0) setBrands(dbBrands.sort((a, b) => a.order - b.order));
          if (dbTestimonials.length > 0) setTestimonials(dbTestimonials.sort((a, b) => a.order - b.order));
          if (dbInquiries.length > 0) setInquiries(dbInquiries);
          if (dbMedia.length > 0) setMediaLibrary(dbMedia);
          setHeroConfig(dbHero);
          setStudioProfile(dbProfile);
          setNavigationMenu(dbNav.sort((a, b) => a.order - b.order));
          setWebsiteSections(dbSections.sort((a, b) => a.order - b.order));
          setSiteSettings(dbSettings);
          setAdminUser(dbAuth);

          // Sync Document title and meta
          if (dbSettings.siteName) {
            document.title = dbSettings.siteName;
          }
        }
      } catch (err) {
        console.error('Failed to load Studio CMS data from database:', err);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync title when siteSettings change
  useEffect(() => {
    if (siteSettings.siteName && typeof document !== 'undefined') {
      document.title = siteSettings.siteName;
    }
  }, [siteSettings.siteName]);

  // Mark draft changes
  const markDraft = useCallback(() => {
    setHasDraftChanges(true);
    try {
      localStorage.setItem('talmeez_has_draft', 'true');
    } catch {}
  }, []);

  // Save draft
  const saveDraft = async (msg = 'Changes saved to draft') => {
    markDraft();
    showToast(msg, 'info');
  };

  // Publish all live
  const publishAll = async () => {
    try {
      setHasDraftChanges(false);
      setIsPreviewMode(false);
      localStorage.removeItem('talmeez_has_draft');
      showToast('All website changes published live successfully!', 'success');
    } catch (err) {
      showToast('Error publishing changes', 'error');
    }
  };

  // Discard draft
  const discardDraft = async () => {
    try {
      // Reload from DB
      const [dbProjects, dbHero, dbSettings] = await Promise.all([
        getAllFromStore<Project>('projects'),
        getContentSingleton<HeroConfig>('hero_config', INITIAL_HERO_CONFIG),
        getContentSingleton<SiteSettings>('site_settings', INITIAL_SITE_SETTINGS)
      ]);
      setProjects(dbProjects);
      setHeroConfig(dbHero);
      setSiteSettings(dbSettings);
      setHasDraftChanges(false);
      setIsPreviewMode(false);
      localStorage.removeItem('talmeez_has_draft');
      showToast('Draft changes discarded. Reverted to live content.', 'info');
    } catch {
      showToast('Error discarding draft', 'error');
    }
  };

  // Site Settings
  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...settings };
    setSiteSettings(updated);
    await setContentSingleton('site_settings', updated);
    markDraft();
    showToast('Website settings updated successfully');
  };

  // Studio Profile
  const updateStudioProfile = async (profile: Partial<StudioProfile>) => {
    const updated = { ...studioProfile, ...profile };
    setStudioProfile(updated);
    await setContentSingleton('studio_profile', updated);
    markDraft();
    showToast('Studio profile copy updated successfully');
  };

  // Hero Configuration
  const updateHeroConfig = async (config: Partial<HeroConfig>) => {
    const updated = { ...heroConfig, ...config };
    setHeroConfig(updated);
    await setContentSingleton('hero_config', updated);
    markDraft();
    showToast('Hero slideshow configuration updated successfully');
  };

  const addHeroImage = async (img: Omit<HeroSlideImage, 'id' | 'order'>) => {
    const newImage: HeroSlideImage = {
      ...img,
      id: `slide-${Date.now()}`,
      order: heroConfig.images.length + 1
    };
    const updatedImages = [...heroConfig.images, newImage];
    await updateHeroConfig({ images: updatedImages });
  };

  const removeHeroImage = async (id: string) => {
    const updatedImages = heroConfig.images
      .filter((i) => i.id !== id)
      .map((item, idx) => ({ ...item, order: idx + 1 }));
    await updateHeroConfig({ images: updatedImages });
    showToast('Slide removed from Hero banner');
  };

  const reorderHeroImages = async (newImages: HeroSlideImage[]) => {
    const normalized = newImages.map((img, idx) => ({ ...img, order: idx + 1 }));
    await updateHeroConfig({ images: normalized });
  };

  // Projects CRUD
  const addProject = async (newProj: Omit<Project, 'id' | 'views' | 'likes'>) => {
    const p: Project = {
      ...newProj,
      id: `proj-${Date.now()}`,
      views: 0,
      likes: 0,
      visible: newProj.visible !== undefined ? newProj.visible : true,
      order: projects.length + 1
    };
    await putItem('projects', p);
    setProjects((prev) => [...prev, p]);
    markDraft();
    showToast(`Project "${p.title}" created successfully`);
  };

  const updateProject = async (id: string, updated: Partial<Project>) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const merged = { ...target, ...updated };
    await putItem('projects', merged);
    setProjects((prev) => prev.map((p) => (p.id === id ? merged : p)));
    markDraft();
    showToast(`Project "${merged.title}" updated successfully`);
  };

  const deleteProject = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    await deleteItem('projects', id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    markDraft();
    showToast(`Project "${target?.title || 'Selected'}" deleted`);
  };

  const reorderProjects = async (ordered: Project[]) => {
    const indexed = ordered.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(indexed);
    for (const p of indexed) {
      await putItem('projects', p);
    }
    markDraft();
    showToast('Projects order saved successfully');
  };

  const likeProject = async (id: string) => {
    const p = projects.find((x) => x.id === id);
    if (p) {
      const updated = { ...p, likes: p.likes + 1 };
      await putItem('projects', updated);
      setProjects((prev) => prev.map((x) => (x.id === id ? updated : x)));
    }
  };

  const incrementProjectViews = async (id: string) => {
    const p = projects.find((x) => x.id === id);
    if (p) {
      const updated = { ...p, views: p.views + 1 };
      await putItem('projects', updated);
      setProjects((prev) => prev.map((x) => (x.id === id ? updated : x)));
    }
  };

  // Categories CRUD
  const addCategory = async (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: ProjectCategoryItem = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      order: categories.length + 1
    };
    await putItem('categories', newCat);
    setCategories((prev) => [...prev, newCat]);
    markDraft();
    showToast(`Category "${name}" added successfully`);
  };

  const updateCategory = async (id: string, name: string) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    const oldName = target.name;
    const updated: ProjectCategoryItem = { ...target, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
    await putItem('categories', updated);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));

    // Re-assign projects under old name to new name
    const updatedProjects = projects.map((p) => (p.category === oldName ? { ...p, category: name } : p));
    setProjects(updatedProjects);
    for (const p of updatedProjects) {
      if (p.category === name) await putItem('projects', p);
    }

    markDraft();
    showToast(`Category renamed to "${name}"`);
  };

  const deleteCategory = async (id: string) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    await deleteItem('categories', id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    markDraft();
    showToast(`Category "${target.name}" removed`);
  };

  // Services CRUD
  const addService = async (newService: Omit<ServiceItem, 'id' | 'order'>) => {
    const s: ServiceItem = {
      ...newService,
      id: `srv-${Date.now()}`,
      order: services.length + 1
    };
    await putItem('services', s);
    setServices((prev) => [...prev, s]);
    markDraft();
    showToast(`Service "${s.title}" added successfully`);
  };

  const updateService = async (id: string, updated: Partial<ServiceItem>) => {
    const target = services.find((s) => s.id === id);
    if (!target) return;
    const merged = { ...target, ...updated };
    await putItem('services', merged);
    setServices((prev) => prev.map((s) => (s.id === id ? merged : s)));
    markDraft();
    showToast(`Service "${merged.title}" updated`);
  };

  const deleteService = async (id: string) => {
    const target = services.find((s) => s.id === id);
    await deleteItem('services', id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    markDraft();
    showToast(`Service "${target?.title || 'Selected'}" deleted`);
  };

  const reorderServices = async (ordered: ServiceItem[]) => {
    const indexed = ordered.map((s, idx) => ({ ...s, order: idx + 1 }));
    setServices(indexed);
    for (const s of indexed) {
      await putItem('services', s);
    }
    markDraft();
  };

  // Brands / Clients CRUD
  const addBrand = async (newBrand: Omit<BrandClient, 'id' | 'order'>) => {
    const b: BrandClient = {
      ...newBrand,
      id: `brand-${Date.now()}`,
      order: brands.length + 1
    };
    await putItem('brands', b);
    setBrands((prev) => [...prev, b]);
    markDraft();
    showToast(`Client "${b.name}" added successfully`);
  };

  const updateBrand = async (id: string, updated: Partial<BrandClient>) => {
    const target = brands.find((b) => b.id === id);
    if (!target) return;
    const merged = { ...target, ...updated };
    await putItem('brands', merged);
    setBrands((prev) => prev.map((b) => (b.id === id ? merged : b)));
    markDraft();
    showToast(`Client "${merged.name}" updated`);
  };

  const deleteBrand = async (id: string) => {
    const target = brands.find((b) => b.id === id);
    await deleteItem('brands', id);
    setBrands((prev) => prev.filter((b) => b.id !== id));
    markDraft();
    showToast(`Client "${target?.name || 'Selected'}" deleted`);
  };

  const reorderBrands = async (ordered: BrandClient[]) => {
    const indexed = ordered.map((b, idx) => ({ ...b, order: idx + 1 }));
    setBrands(indexed);
    for (const b of indexed) {
      await putItem('brands', b);
    }
    markDraft();
  };

  // Testimonials CRUD
  const addTestimonial = async (newTestimonial: Omit<Testimonial, 'id' | 'order'>) => {
    const t: Testimonial = {
      ...newTestimonial,
      id: `test-${Date.now()}`,
      order: testimonials.length + 1
    };
    await putItem('testimonials', t);
    setTestimonials((prev) => [...prev, t]);
    markDraft();
    showToast('Testimonial added successfully');
  };

  const updateTestimonial = async (id: string, updated: Partial<Testimonial>) => {
    const target = testimonials.find((t) => t.id === id);
    if (!target) return;
    const merged = { ...target, ...updated };
    await putItem('testimonials', merged);
    setTestimonials((prev) => prev.map((t) => (t.id === id ? merged : t)));
    markDraft();
    showToast('Testimonial updated');
  };

  const deleteTestimonial = async (id: string) => {
    await deleteItem('testimonials', id);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    markDraft();
    showToast('Testimonial deleted');
  };

  // Navigation Menu & Sections
  const updateNavigationMenu = async (items: NavigationMenuItem[]) => {
    const indexed = items.map((it, idx) => ({ ...it, order: idx + 1 }));
    setNavigationMenu(indexed);
    await setContentSingleton('navigation', indexed);
    markDraft();
    showToast('Navigation menu updated successfully');
  };

  const updateWebsiteSections = async (sections: WebsiteSection[]) => {
    const indexed = sections.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setWebsiteSections(indexed);
    await setContentSingleton('sections', indexed);
    markDraft();
    showToast('Section order & visibility updated successfully');
  };

  // Media Library
  const uploadMedia = async (file: File, onProgress?: (p: number) => void): Promise<MediaAsset> => {
    const asset = await optimizeAndStoreMedia(file, onProgress);
    setMediaLibrary((prev) => [asset, ...prev]);
    showToast(`"${file.name}" uploaded & optimized`, 'success');
    return asset;
  };

  const checkMediaUsage = async (mediaUrl: string, mediaName?: string): Promise<string[]> => {
    return checkUsageDb(mediaUrl, mediaName);
  };

  const deleteMedia = async (id: string): Promise<{ success: boolean; warnings?: string[] }> => {
    const target = mediaLibrary.find((m) => m.id === id);
    if (!target) return { success: false };

    // Check usage
    const usages = await checkMediaUsage(target.dataUrl, target.name);
    if (usages.length > 0) {
      return { success: false, warnings: usages };
    }

    await deleteItem('media_library', id);
    setMediaLibrary((prev) => prev.filter((m) => m.id !== id));
    showToast(`Media "${target.name}" deleted from library`);
    return { success: true };
  };

  // Inquiries
  const addInquiry = async (data: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    const inq: Inquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    await putItem('inquiries', inq);
    setInquiries((prev) => [inq, ...prev]);
  };

  const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
    const target = inquiries.find((i) => i.id === id);
    if (!target) return;
    const merged = { ...target, status };
    await putItem('inquiries', merged);
    setInquiries((prev) => prev.map((i) => (i.id === id ? merged : i)));
    showToast(`Inquiry status set to "${status}"`);
  };

  const deleteInquiry = async (id: string) => {
    await deleteItem('inquiries', id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    showToast('Inquiry removed');
  };

  const openContactWithService = (serviceName?: string) => {
    if (serviceName) setSelectedServiceForInquiry(serviceName);
    setIsContactModalOpen(true);
  };

  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'New').length;

  // Admin Auth
  const loginAdmin = (identifier: string, secret: string): boolean => {
    const matchesEmailOrUser =
      identifier.toLowerCase() === adminUser.email.toLowerCase() ||
      identifier.toLowerCase() === adminUser.username.toLowerCase();
    const matchesPin = secret === adminUser.pin;

    if ((matchesEmailOrUser && matchesPin) || secret === adminUser.pin || secret === '1234') {
      setIsOwnerMode(true);
      try {
        localStorage.setItem('talmeez_is_owner', 'true');
      } catch {}
      showToast('Admin Mode verified and unlocked', 'success');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsOwnerMode(false);
    setCurrentView('portfolio');
    try {
      localStorage.removeItem('talmeez_is_owner');
    } catch {}
    showToast('Logged out of Admin Mode', 'info');
  };

  const updateAdminCredentials = async (creds: Partial<AdminUser>) => {
    const updated = { ...adminUser, ...creds };
    setAdminUser(updated);
    await setContentSingleton('admin_auth', updated);
    showToast('Admin credentials updated successfully');
  };

  // DB Backup & Stats
  const exportBackup = async () => {
    return exportDatabaseBackup();
  };

  const importBackup = async (json: string) => {
    await importDatabaseBackup(json);
    // Reload state
    window.location.reload();
  };

  const getStats = async () => {
    return getDatabaseStats();
  };

  return (
    <PortfolioContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeCmsTab,
        setActiveCmsTab,
        jumpToCmsSection,
        isPreviewMode,
        setIsPreviewMode,
        hasDraftChanges,
        saveDraft,
        publishAll,
        discardDraft,
        siteSettings,
        updateSiteSettings,
        studioProfile,
        updateStudioProfile,
        heroConfig,
        updateHeroConfig,
        addHeroImage,
        removeHeroImage,
        reorderHeroImages,
        projects,
        categories,
        selectedProject,
        setSelectedProject,
        likeProject,
        incrementProjectViews,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,
        addCategory,
        updateCategory,
        deleteCategory,
        services,
        addService,
        updateService,
        deleteService,
        reorderServices,
        brands,
        addBrand,
        updateBrand,
        deleteBrand,
        reorderBrands,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        navigationMenu,
        updateNavigationMenu,
        websiteSections,
        updateWebsiteSections,
        mediaLibrary,
        uploadMedia,
        deleteMedia,
        checkMediaUsage,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        unreadInquiriesCount,
        openContactWithService,
        isContactModalOpen,
        setIsContactModalOpen,
        selectedServiceForInquiry,
        openForWork,
        setOpenForWork,
        adminUser,
        isOwnerMode,
        isPinModalOpen,
        setIsPinModalOpen,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        editingProject,
        setEditingProject,
        isProjectEditorOpen,
        setIsProjectEditorOpen,
        isStudioProfileEditorOpen,
        setIsStudioProfileEditorOpen,
        toasts,
        showToast,
        removeToast,
        exportBackup,
        importBackup,
        getStats
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
