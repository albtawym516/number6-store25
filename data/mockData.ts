import { Product, Order, OrderStatus, CartItem } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'تيشيرت قطني كلاسيكي',
    sku: 'N6-TS-001',
    price: 150,
    salePrice: 120,
    category: 'men',
    description: 'تيشيرت قطني 100% عالي الجودة بتصميم كلاسيكي مريح. مثالي للاستخدام اليومي ويأتي بألوان متعددة تناسب جميع الأذواق.',
    images: [
      'https://picsum.photos/seed/p1a/1600/1600',
      'https://picsum.photos/seed/p1b/1600/1600',
      'https://picsum.photos/seed/p1c/400/400',
      'https://picsum.photos/seed/p1d/400/400'
    ],
    rating: 4.5,
    reviewCount: 120,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['أسود', 'أبيض', 'رمادي'],
    stock: 50,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'فستان صيفي أنيق',
    sku: 'N6-DR-002',
    price: 350,
    category: 'women',
    description: 'فستان صيفي خفيف بقصة عصرية وألوان زاهية. مصنوع من قماش الفيسكوز الناعم ليوفر لكِ الراحة والأناقة في الأيام الحارة.',
    images: [
      'https://picsum.photos/seed/p2a/1600/1600',
      'https://picsum.photos/seed/p2b/1600/1600',
      'https://picsum.photos/seed/p2c/400/400'
    ],
    rating: 4.8,
    reviewCount: 88,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['أزرق سماوي', 'وردي', 'أصفر'],
    stock: 30,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'طقم رياضي للأطفال',
    sku: 'N6-KD-003',
    price: 220,
    category: 'kids',
    description: 'طقم رياضي مريح وعملي للأطفال، يتكون من تيشيرت وشورت. تصميم مرح يسمح بحرية الحركة أثناء اللعب.',
    images: [
      'https://picsum.photos/seed/p3a/1600/1600',
      'https://picsum.photos/seed/p3b/1600/1600',
    ],
    rating: 4.9,
    reviewCount: 210,
    sizes: ['4 سنوات', '6 سنوات', '8 سنوات'],
    colors: ['أحمر', 'أزرق'],
    stock: 45,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'جاكيت جينز عصري',
    sku: 'N6-JK-004',
    price: 450,
    salePrice: 400,
    category: 'men',
    description: 'جاكيت جينز بقصة عصرية يضيف لمسة من الأناقة إلى إطلالتك. يمكن تنسيقه بسهولة مع مختلف الملابس.',
    images: [
      'https://picsum.photos/seed/p4a/1600/1600',
      'https://picsum.photos/seed/p4b/1600/1600',
      'https://picsum.photos/seed/p4c/1600/1600',
    ],
    rating: 4.7,
    reviewCount: 95,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['أزرق داكن', 'أسود'],
    stock: 25,
    isFeatured: true,
  },
];

const sampleCartItems: CartItem[] = [
    { id: 'ci1', product: mockProducts[1], quantity: 1, size: 'M', color: 'وردي' }, // 350
    { id: 'ci2', product: mockProducts[0], quantity: 1, size: 'L', color: 'أسود' }, // 120
];

const sampleCartItems2: CartItem[] = [
    { id: 'ci3', product: mockProducts[2], quantity: 1, size: '6 سنوات', color: 'أحمر' }, // 220
];


export const mockOrders: Order[] = [
  {
    id: 'ORD-12345',
    items: sampleCartItems,
    total: 470,
    status: OrderStatus.Shipped,
    date: '2023-10-26',
    shippingInfo: {
        fullName: 'أحمد محمود',
        email: 'ahmed@example.com',
        phone: '01234567890',
        address: '123 شارع النصر',
        city: 'القاهرة',
        country: 'مصر',
        postalCode: '11511'
    }
  },
  {
    id: 'ORD-12346',
    items: sampleCartItems2,
    total: 220,
    status: OrderStatus.Processing,
    date: '2023-10-25',
    shippingInfo: {
        fullName: 'فاطمة علي',
        email: 'fatima@example.com',
        phone: '01098765432',
        address: '456 شارع الجمهورية',
        city: 'الاسكندرية',
        country: 'مصر',
        postalCode: '21522'
    }
  }
];