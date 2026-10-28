export interface ProjectCategoryItem {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export type ProjectCategory = string;

export interface Project {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  image: string;
  galleryImages?: string[];
  summary: string;
  description: string;
  views: number;
  likes: number;
  featured: boolean;
  visible: boolean;
  order: number;
  colorPalette: string[];
  deliverables: string[];
  tags: string[];
}

export type InquiryStatus = 'New' | 'In Discussion' | 'Booked' | 'Archived';

export interface Inquiry {
  id: string;
  clientName: string;
  email: string;
  company?: string;
  service: string;
  timeline: string;
  message: string;
  date: string;
  status: InquiryStatus;
  notes?: string;
  budget?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  avatar: string;
  visible: boolean;
  order: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Layout' | 'Globe' | 'Sparkles' | 'PenTool' | 'Layers' | 'Palette' | 'Eye' | 'Package';
  image?: string;
  deliverables: string[];
  visible: boolean;
  order: number;
}

export interface BrandClient {
  id: string;
  name: string;
  logo: string;
  industry?: string;
  website?: string;
  visible: boolean;
  order: number;
}

export type SlideshowAnimationStyle = 'fade' | 'slide-left' | 'slide-right' | 'zoom-in' | 'ken-burns';
export type ImageDisplayStyle = 'cover' | 'contain' | 'fill';
export type ImageAspectRatio = '1:1' | '4:5' | '16:9' | 'asymmetric';
export type ImagePosition = 'center' | 'top' | 'bottom';

export interface HeroSlideImage {
  id: string;
  url: string;
  title?: string;
  caption?: string;
  order: number;
}

export interface HeroConfig {
  images: HeroSlideImage[];
  animationStyle: SlideshowAnimationStyle;
  slideDuration: number; // in seconds
  transitionSpeed: number; // in seconds
  autoplay: boolean;
  showControls: boolean;
  showIndicators: boolean;
  displayStyle: ImageDisplayStyle;
  aspectRatio: ImageAspectRatio;
  imagePosition: ImagePosition;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  visible: boolean;
  order: number;
}

export interface WebsiteSection {
  id: string;
  key: 'hero' | 'services' | 'projects' | 'brands' | 'about' | 'testimonials' | 'cta' | 'contact';
  label: string;
  visible: boolean;
  order: number;
  badge?: string;
  title?: string;
  subtitle?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  mimeType: string;
  size: number;
  dataUrl: string;
  uploadDate: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  logoText: string;
  faviconUrl: string;
  contactPhone: string;
  contactEmail: string;
  contactTelegram: string;
  contactFacebook: string;
  contactInstagram: string;
  contactTikTok: string;
  contactLinkedIn: string;
  contactTwitter: string;
  address: string;
  workingHours: string;
  googleMapsEmbed: string;
  footerText: string;
  copyrightText: string;
}

export interface AnalyticsStats {
  totalVisitors: number;
  totalProjectViews: number;
  totalInquiries: number;
  conversionRate: number;
  publishedProjectsCount: number;
}

export interface StudioProfile {
  designerName: string;
  brandTitle: string;
  headlinePrefix: string;
  headlineHighlight: string;
  subtitle: string;
  experienceBadge: string;
  email: string;
  phone: string;
  location: string;
  workingHours: string;
  metricYears: string;
  metricProjects: string;
  metricClients: string;
  metricCountries: string;
}

export interface AdminUser {
  email: string;
  username: string;
  pin: string;
}

export interface CmsToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
