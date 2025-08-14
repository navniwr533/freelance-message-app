export type Case = {
  slug: string;
  name: string;
  tag: string;
  summary: string;
  img?: string;
  gallery?: { src: string; alt: string; credit?: { text: string; url?: string } }[];
};

export const cases: Record<string, Case> = {
  'dawn-commerce': {
    slug: 'dawn-commerce',
    name: 'Dawn Commerce',
    tag: 'E‑commerce',
    summary:
      'Modern storefront with fast product discovery, smooth checkout, and a brand-forward visual system.',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1600&auto=format&fit=crop', alt: 'Product grid with filters', credit: { text: 'Unsplash', url: 'https://unsplash.com' } },
      { src: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop', alt: 'Checkout flow UI', credit: { text: 'Unsplash', url: 'https://unsplash.com' } },
      { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop', alt: 'Brand components and style system', credit: { text: 'Unsplash', url: 'https://unsplash.com' } },
    ],
  },
  'peak-fitness': {
    slug: 'peak-fitness',
    name: 'Peak Fitness',
    tag: 'Mobile App',
    summary:
      'Coaching app with programs, habit tracking, and delightful micro-interactions for adherence.',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1600&auto=format&fit=crop', alt: 'Program overview screen' },
      { src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1600&auto=format&fit=crop', alt: 'Habit tracking interface' },
      { src: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop', alt: 'Micro-interaction delight' },
    ],
  },
  'casa-interior': {
    slug: 'casa-interior',
    name: 'Casa Interior',
    tag: 'Brand + Site',
    summary:
      'Elegant interior design brand site highlighting materials, texture, and calm editorial layout.',
    img: 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop', alt: 'Editorial layout with generous whitespace' },
      { src: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop', alt: 'Material palette and textures' },
      { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop', alt: 'Typography and image balance' },
    ],
  },
  'vista-ai': {
    slug: 'vista-ai',
    name: 'Vista AI',
    tag: 'SaaS',
    summary:
      'AI dashboard with human-friendly copy, clear information architecture, and rapid onboarding.',
    img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop', alt: 'Dashboard IA and cards' },
      { src: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1600&auto=format&fit=crop', alt: 'Onboarding flow screens' },
      { src: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1600&auto=format&fit=crop', alt: 'Data vis components' },
    ],
  },
};
