export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  category: 'men' | 'women' | 'kids';
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export enum OrderStatus {
  Processing = 'جاري التجهيز',
  Shipped = 'جاري التوصيل',
  Delivered = 'تم التوصيل',
  Cancelled = 'ملغي',
  Problem = 'عطل',
}

export interface ShippingInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  shippingInfo: ShippingInfo;
}

export interface ThemeSettings {
  accentColor: string;
  announcementText: string;
  hero: {
    headline: string;
    subheading: string;
    imageUrl: string;
    ctaText: string;
  };
  categoryImages: {
    men: string;
    women: string;
    kids: string;
  };
  featuredProductsTitle: string;
  features: [
    { title: string; description: string; },
    { title: string; description: string; },
    { title: string; description: string; }
  ];
}