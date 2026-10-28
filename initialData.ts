import { 
  Project, 
  ServiceItem, 
  Testimonial, 
  Inquiry, 
  ProjectCategoryItem, 
  HeroConfig, 
  BrandClient, 
  NavigationMenuItem, 
  WebsiteSection, 
  SiteSettings, 
  StudioProfile,
  AdminUser
} from '../types';

export const HERO_PORTRAIT = '/src/assets/images/hero_designer_portrait_1793179168215.jpg';

export const INITIAL_CATEGORIES: ProjectCategoryItem[] = [
  { id: 'cat-1', name: 'Packaging', slug: 'packaging', order: 1 },
  { id: 'cat-2', name: 'Brand Identity', slug: 'brand-identity', order: 2 },
  { id: 'cat-3', name: 'Graphic Design', slug: 'graphic-design', order: 3 },
  { id: 'cat-4', name: 'Editorial', slug: 'editorial', order: 4 },
  { id: 'cat-5', name: 'UI/UX', slug: 'ui-ux', order: 5 }
];

export const INITIAL_HERO_CONFIG: HeroConfig = {
  images: [
    {
      id: 'hero-1',
      url: '/src/assets/images/hero_designer_portrait_1793179168215.jpg',
      title: 'Studio Director Portrait',
      caption: 'Creative Direction & Brand Architect',
      order: 1
    },
    {
      id: 'hero-2',
      url: '/src/assets/images/project_brand_identity_1793179169105.jpg',
      title: 'Axon Brand Overhaul',
      caption: 'Kinetic Identity & Modern Geometry',
      order: 2
    },
    {
      id: 'hero-3',
      url: '/src/assets/images/project_packaging_boxes_1793179168555.jpg',
      title: 'Aura Luxury Packaging',
      caption: 'Copper Foil Debossing & Unboxing Suite',
      order: 3
    },
    {
      id: 'hero-4',
      url: '/src/assets/images/project_editorial_magazine_1793179170586.jpg',
      title: 'Swiss Modernist Editorial',
      caption: 'Asymmetric Swiss Typographic Monograph',
      order: 4
    }
  ],
  animationStyle: 'fade',
  slideDuration: 4.5,
  transitionSpeed: 0.8,
  autoplay: true,
  showControls: true,
  showIndicators: true,
  displayStyle: 'cover',
  aspectRatio: '4:5',
  imagePosition: 'center'
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Aura Skincare Packaging & Box System',
    category: 'Packaging',
    client: 'Aura Botanicals London',
    year: '2026',
    image: '/src/assets/images/project_packaging_boxes_1793179168555.jpg',
    galleryImages: [
      '/src/assets/images/project_packaging_boxes_1793179168555.jpg',
      '/src/assets/images/project_luxury_shopping_bag_1793179170621.jpg'
    ],
    summary: 'Luxury matte navy & eco-craft unboxing experience with metallic copper foil finish.',
    description: 'A comprehensive structural packaging suite designed for high-end organic skincare. Developed custom die-cuts, tactile blind debossing, sustainable soy ink seals, and tamper-evident branded adhesive ribbons for global e-commerce and boutique distribution.',
    views: 1842,
    likes: 312,
    featured: true,
    visible: true,
    order: 1,
    colorPalette: ['#1A2536', '#C79A73', '#D6B995', '#F5EBE1', '#0F1622'],
    deliverables: ['Custom Box Die-Cuts', 'Debossed Foil Sleeves', 'Product Labels', 'Retail Display Guidelines'],
    tags: ['Packaging', 'Luxury', 'Print Finish', 'Sustainable']
  },
  {
    id: 'proj-2',
    title: 'Axon Technologies Visual Identity & Brand System',
    category: 'Brand Identity',
    client: 'Axon Tech Labs',
    year: '2026',
    image: '/src/assets/images/project_brand_identity_1793179169105.jpg',
    galleryImages: [
      '/src/assets/images/project_brand_identity_1793179169105.jpg',
      '/src/assets/images/hero_designer_portrait_1793179168215.jpg'
    ],
    summary: 'High-energy kinetic identity system with vibrant signal orange and architectural typography.',
    description: 'Complete brand overhaul for an enterprise cloud computation network. Delivered a unified graphic design language including bespoke wordmark geometry, physical stationery, organic cotton merchandise, event lanyards, and digital design system tokenization.',
    views: 2450,
    likes: 489,
    featured: true,
    visible: true,
    order: 2,
    colorPalette: ['#EA580C', '#27272A', '#F4F4F5', '#FFFFFF', '#71717A'],
    deliverables: ['Dynamic Logo Suite', 'Stationery Kit', 'Merch & Tote Design', 'Brand Guidelines Manual'],
    tags: ['Brand Identity', 'Stationery', 'Typography', 'Tech']
  },
  {
    id: 'proj-3',
    title: 'Aurélia Luxury Retail Paper Bag & Embossed Embellishment',
    category: 'Graphic Design',
    client: 'Maison Aurélia Haute Couture',
    year: '2025',
    image: '/src/assets/images/project_luxury_shopping_bag_1793179170621.jpg',
    galleryImages: [
      '/src/assets/images/project_luxury_shopping_bag_1793179170621.jpg',
      '/src/assets/images/project_packaging_boxes_1793179168555.jpg'
    ],
    summary: 'Tactile textured black card stock with hot-stamped gold foil heraldic crest.',
    description: 'Bespoke packaging and shopping bag execution for luxury boutique flagship stores. Features custom micro-pattern geometric blind embossing, grosgrain cotton ribbon handles, and gold edge-gilded structural folds.',
    views: 1620,
    likes: 275,
    featured: true,
    visible: true,
    order: 3,
    colorPalette: ['#121214', '#D4AF37', '#2A2A2E', '#F3EFE6'],
    deliverables: ['Retail Shopping Bags', 'Blind Emboss Patterns', 'Foil Stamp Tooling', 'Materials Specification'],
    tags: ['Graphic Design', 'Foil Stamping', 'Luxury', 'Editorial']
  },
  {
    id: 'proj-4',
    title: 'Swiss Modernist Vision: Editorial Magazine & Poster System',
    category: 'Editorial',
    client: 'Zurich Design Archive',
    year: '2026',
    image: '/src/assets/images/project_editorial_magazine_1793179170586.jpg',
    galleryImages: [
      '/src/assets/images/project_editorial_magazine_1793179170586.jpg'
    ],
    summary: 'Rigorous Swiss grid monograph exploring typography, asymmetry, and modern structures.',
    description: 'An experimental 120-page design publication paying homage to Josef Müller-Brockmann and modern graphic syntax. Crafted custom type specimen layouts, dual-color duotone imagery, poster inserts, and screen-printed jacket.',
    views: 3105,
    likes: 620,
    featured: true,
    visible: true,
    order: 4,
    colorPalette: ['#EA580C', '#18181B', '#E4E4E7', '#FAFAFA'],
    deliverables: ['120-Page Publication', 'B1 Exhibition Posters', 'Editorial Grid System', 'Binding Specs'],
    tags: ['Editorial', 'Swiss Style', 'Typography', 'Print']
  },
  {
    id: 'proj-5',
    title: 'Talmeez Contemporary Portfolio Architecture',
    category: 'UI/UX',
    client: 'Design Studio Showcase',
    year: '2026',
    image: '/public/assets/aistudio/Contemporary_Figma_Portfolio_Website_Template_d7a28fd7.jpg',
    galleryImages: [
      '/public/assets/aistudio/Contemporary_Figma_Portfolio_Website_Template_d7a28fd7.jpg'
    ],
    summary: 'Full-bleed responsive layout with smooth transitions, analytics engine, and client inquiry portal.',
    description: 'The contemporary digital portfolio framework built to display high-resolution creative works seamlessly on both mobile smartphones and ultra-wide desktop monitors, featuring real-time view tracking and client inquiry management.',
    views: 4210,
    likes: 890,
    featured: true,
    visible: true,
    order: 5,
    colorPalette: ['#EA580C', '#1E1E1E', '#FFFFFF', '#FBFBFA'],
    deliverables: ['Figma System Components', 'Mobile Responsive Views', 'Interactive Motion Specs', 'Analytics Dashboard UI'],
    tags: ['UI/UX', 'Portfolio', 'Interactive', 'Motion']
  }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'UI/UX Design',
    description: 'Craft intuitive, user-focused digital interfaces and scalable design systems that convert.',
    iconName: 'Layout',
    deliverables: ['Wireframing & Prototypes', 'Mobile & Web UI', 'Design Systems & Tokens', 'Interaction Specs'],
    visible: true,
    order: 1
  },
  {
    id: 'srv-2',
    title: 'Web Design',
    description: 'High-impact responsive websites built with modern aesthetics, fast loading speeds, and micro-animations.',
    iconName: 'Globe',
    deliverables: ['Responsive Web Layouts', 'Landing Page Optimization', 'Interactive Prototypes', 'Asset Production'],
    visible: true,
    order: 2
  },
  {
    id: 'srv-3',
    title: 'Brand Identity',
    description: 'Distinctive visual identities, bespoke logomarks, typography rules, and strategic brand guidelines.',
    iconName: 'Sparkles',
    deliverables: ['Logo & Mark Development', 'Color & Type Strategy', 'Stationery & Collateral', 'Comprehensive Brandbook'],
    visible: true,
    order: 3
  },
  {
    id: 'srv-4',
    title: 'Graphic Design',
    description: 'Sensory packaging, exhibition editorial layouts, retail print materials, and bold digital visuals.',
    iconName: 'PenTool',
    deliverables: ['Luxury Packaging & Die-cuts', 'Editorial & Publications', 'Poster & Marketing Collateral', 'Print Production Specs'],
    visible: true,
    order: 4
  }
];

export const INITIAL_BRANDS: BrandClient[] = [
  {
    id: 'brand-1',
    name: 'Aura Botanicals',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80',
    industry: 'Luxury Cosmetics',
    website: 'https://aurabotanicals.com',
    visible: true,
    order: 1
  },
  {
    id: 'brand-2',
    name: 'Axon Tech Labs',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    industry: 'Enterprise Computing',
    website: 'https://axonlabs.io',
    visible: true,
    order: 2
  },
  {
    id: 'brand-3',
    name: 'Maison Aurélia',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
    industry: 'Haute Couture',
    website: 'https://aurelia-paris.com',
    visible: true,
    order: 3
  },
  {
    id: 'brand-4',
    name: 'Zurich Design Archive',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
    industry: 'Cultural Institution',
    website: 'https://zurichdesign.ch',
    visible: true,
    order: 4
  },
  {
    id: 'brand-5',
    name: 'Nordic Audio Systems',
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    industry: 'Acoustic Engineering',
    website: 'https://nordicaudio.se',
    visible: true,
    order: 5
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote: 'Talmeez has a unique ability to understand our brand ethos and translate it into visuals that truly connect with high-value customers. The packaging redesign increased our online conversion by 48%.',
    author: 'John Snow',
    role: 'Founder',
    company: 'Orin Retail & Goods',
    rating: 5,
    avatar: 'JS',
    visible: true,
    order: 1
  },
  {
    id: 'test-2',
    quote: 'Working with Talmeez was seamless. The brand identity system for Axon received immediate praise from our investors and clients alike. Highly disciplined typography and exceptional delivery.',
    author: 'Elena Vance',
    role: 'Chief Brand Officer',
    company: 'Axon Tech Labs',
    rating: 5,
    avatar: 'EV',
    visible: true,
    order: 2
  },
  {
    id: 'test-3',
    quote: 'Every graphic detail was meticulously crafted, from the tactile foil specifications to the unboxing rhythm. Talmeez is hands down the most reliable graphic designer we have collaborated with.',
    author: 'Marcus Chen',
    role: 'Creative Director',
    company: 'Aura Botanicals',
    rating: 5,
    avatar: 'MC',
    visible: true,
    order: 3
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-101',
    clientName: 'Sophia Lindqvist',
    email: 'sophia@nordicaudio.se',
    company: 'Nordic Audio Systems',
    service: 'Brand Identity & Packaging',
    timeline: '3 - 4 weeks',
    message: 'We are launching a new line of minimalist wireless studio monitors and need a cohesive visual identity, packaging die-cuts, and product unboxing collateral.',
    date: '2026-10-27',
    status: 'New'
  },
  {
    id: 'inq-102',
    clientName: 'David Kalu',
    email: 'david@meridianroasters.com',
    company: 'Meridian Specialty Coffee',
    service: 'Packaging & Print Design',
    timeline: 'Within 2 weeks',
    message: 'Looking to redesign our specialty coffee bean bags and retail boxes with foil-stamped elements and custom origin stickers.',
    date: '2026-10-25',
    status: 'In Discussion'
  },
  {
    id: 'inq-103',
    clientName: 'Camille Benoit',
    email: 'c.benoit@lumieremag.fr',
    company: 'Lumière Quarterly Magazine',
    service: 'Editorial & Graphic Design',
    timeline: '1 - 2 months',
    message: 'Seeking an art director to redesign our biannual architectural print journal and curate the typography hierarchy for issue #14.',
    date: '2026-10-20',
    status: 'Booked'
  }
];

export const INITIAL_STUDIO_PROFILE: StudioProfile = {
  designerName: 'Talmeez',
  brandTitle: 'talmeez',
  headlinePrefix: 'Design That',
  headlineHighlight: 'Builds Brands.',
  subtitle: 'I help ambitious brands stand out with bold, strategic and unforgettable graphic design, luxury packaging, and digital identities.',
  experienceBadge: '5+ Years',
  email: 'hello@talmeezdesign.com',
  phone: '+1 (555) 392-8100',
  location: 'London & Worldwide Remote',
  workingHours: 'Mon - Fri: 09:00 - 18:00 GMT',
  metricYears: '5+',
  metricProjects: '100+',
  metricClients: '50+',
  metricCountries: '10+'
};

export const INITIAL_NAVIGATION: NavigationMenuItem[] = [
  { id: 'nav-1', label: 'Home', href: '#hero', visible: true, order: 1 },
  { id: 'nav-2', label: 'Services', href: '#services', visible: true, order: 2 },
  { id: 'nav-3', label: 'Work', href: '#projects', visible: true, order: 3 },
  { id: 'nav-4', label: 'Brands', href: '#brands', visible: true, order: 4 },
  { id: 'nav-5', label: 'About', href: '#about', visible: true, order: 5 },
  { id: 'nav-6', label: 'Contact', href: '#contact', visible: true, order: 6 }
];

export const INITIAL_SECTIONS: WebsiteSection[] = [
  { id: 'sec-hero', key: 'hero', label: 'Hero / Banner', visible: true, order: 1, badge: 'Welcome', title: 'Design That Builds Brands' },
  { id: 'sec-services', key: 'services', label: 'Services', visible: true, order: 2, badge: 'Capabilities', title: 'What I Do' },
  { id: 'sec-projects', key: 'projects', label: 'Projects & Works', visible: true, order: 3, badge: 'Selected Work', title: 'Featured Projects' },
  { id: 'sec-brands', key: 'brands', label: 'Clients & Brands', visible: true, order: 4, badge: 'Collaborations', title: 'Trusted By Global Brands' },
  { id: 'sec-about', key: 'about', label: 'About & Metrics', visible: true, order: 5, badge: 'Milestones', title: 'Studio Track Record' },
  { id: 'sec-testimonials', key: 'testimonials', label: 'Testimonials', visible: true, order: 6, badge: 'Reviews', title: 'Trusted by Great Clients' },
  { id: 'sec-cta', key: 'cta', label: 'Call to Action', visible: true, order: 7, badge: 'Let\'s Collaborate', title: 'Have a project in mind?' },
  { id: 'sec-contact', key: 'contact', label: 'Contact & Inquiries', visible: true, order: 8, badge: 'Get In Touch', title: 'Ready to elevate your brand?' }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteName: 'Talmeez — Graphic Design & Brand Identity Studio',
  siteDescription: 'Interactive animated portfolio website showcasing brand identity, packaging, and graphic design with high-resolution gallery and client inquiry dashboard.',
  logoUrl: '',
  logoText: 'talmeez',
  faviconUrl: '',
  contactPhone: '+1 (555) 392-8100',
  contactEmail: 'hello@talmeezdesign.com',
  contactTelegram: '@talmeez_studio',
  contactFacebook: 'https://facebook.com/talmeezstudio',
  contactInstagram: 'https://instagram.com/talmeezdesign',
  contactTikTok: 'https://tiktok.com/@talmeezdesign',
  contactLinkedIn: 'https://linkedin.com/in/talmeez',
  contactTwitter: 'https://x.com/talmeezdesign',
  address: '14 Berkeley Square, Mayfair, London W1J 6BQ, United Kingdom',
  workingHours: 'Mon - Fri: 09:00 - 18:00 GMT / Worldwide Remote',
  googleMapsEmbed: 'https://maps.google.com/maps?q=Mayfair%20London&t=&z=13&ie=UTF8&iwloc=&output=embed',
  footerText: 'Designing bold brands that make impact. Specializing in high-end brand identities, sensory packaging, and modern editorial systems.',
  copyrightText: '© 2026 Talmeez Design Studio. All rights reserved.'
};

export const INITIAL_ADMIN: AdminUser = {
  email: 'admin@studio.design',
  username: 'admin',
  pin: '1234'
};
