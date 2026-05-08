import { Product } from '../models/product.models';
import { INDIAN_STATES } from '../constants/indian-states';

const categoryData = [
  {
    value: 'mobiles',
    label: 'Mobiles',
    titles: ['iPhone 14 128GB', 'Samsung Galaxy S23', 'OnePlus 12R', 'Google Pixel 8', 'Redmi Note 13 Pro', 'Vivo V30'],
    descriptions: ['Original bill available', 'Single owner device', 'Box and charger included', 'Battery health checked'],
    color: '#1565c0',
    minPrice: 8500,
    step: 750
  },
  {
    value: 'cars',
    label: 'Cars',
    titles: ['Maruti Swift', 'Hyundai i20', 'Tata Nexon', 'Honda City', 'Mahindra XUV300', 'Toyota Glanza'],
    descriptions: ['Insurance active', 'Service history available', 'Clean car interior', 'Recently serviced'],
    color: '#2e7d32',
    minPrice: 185000,
    step: 8500
  },
  {
    value: 'electronics',
    label: 'Electronics',
    titles: ['Sony Bravia TV', 'Dell Inspiron Laptop', 'Canon DSLR Camera', 'JBL Soundbar', 'Apple iPad', 'LG Washing Machine'],
    descriptions: ['Works perfectly', 'Demo available before purchase', 'Clean condition', 'Accessories included'],
    color: '#6a1b9a',
    minPrice: 4500,
    step: 640
  },
  {
    value: 'furniture',
    label: 'Furniture',
    titles: ['Sofa Set 3+1+1', 'Queen Size Bed', 'Dining Table Set', 'Study Desk', 'Office Chair', 'Wardrobe'],
    descriptions: ['Well maintained', 'Ready to move', 'No major scratches', 'Ideal for home setup'],
    color: '#795548',
    minPrice: 2800,
    step: 520
  },
  {
    value: 'fashion',
    label: 'Fashion',
    titles: ['Leather Jacket', 'Designer Saree', 'Sneakers', 'Formal Blazer', 'Smart Watch', 'Travel Backpack'],
    descriptions: ['Lightly used', 'Freshly cleaned', 'Premium material', 'Great everyday pick'],
    color: '#c2185b',
    minPrice: 700,
    step: 180
  },
  {
    value: 'property',
    label: 'Property',
    titles: ['1 BHK Apartment', '2 BHK Flat', 'Commercial Shop', 'Studio Room', 'PG Room', 'Warehouse Space'],
    descriptions: ['Prime locality', 'Broker-free listing', 'Ready for visit', 'Good connectivity'],
    color: '#ef6c00',
    minPrice: 6500,
    step: 1250
  }
] as const;

const conditions: Product['condition'][] = ['new', 'like-new', 'good', 'fair'];
const sellers = [
  { id: 'seller-1', name: 'Rahul' },
  { id: 'seller-2', name: 'Ananya' },
  { id: 'seller-3', name: 'Vikram' },
  { id: 'seller-4', name: 'Meera' },
  { id: 'seller-5', name: 'Arjun' },
  { id: 'buyer-1', name: 'Demo Buyer' }
];

function createImage(title: string, categoryLabel: string, color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
      <rect width="900" height="600" fill="#f7fafc"/>
      <rect x="48" y="48" width="804" height="504" rx="28" fill="${color}"/>
      <circle cx="735" cy="150" r="72" fill="rgba(255,255,255,.18)"/>
      <circle cx="145" cy="470" r="96" fill="rgba(255,255,255,.12)"/>
      <text x="84" y="160" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="#ffffff">${categoryLabel}</text>
      <text x="84" y="292" font-family="Arial, sans-serif" font-size="58" font-weight="700" fill="#ffffff">${title}</text>
      <text x="84" y="380" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,.86)">Verified recommerce listing</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createProduct(categoryIndex: number, itemIndex: number): Product {
  const category = categoryData[categoryIndex];
  const title = category.titles[itemIndex % category.titles.length];
  const productTitle = `${title} ${itemIndex + 1}`;
  const condition = conditions[(itemIndex + categoryIndex) % conditions.length];
  const location = INDIAN_STATES[(itemIndex + categoryIndex * 2) % INDIAN_STATES.length];
  const seller = sellers[(itemIndex + categoryIndex) % sellers.length];
  const day = ((itemIndex + categoryIndex) % 28) + 1;
  const price = category.minPrice + itemIndex * category.step + categoryIndex * 300;

  return {
    id: `${category.value}-${itemIndex + 1}`,
    title: productTitle,
    description: `${category.descriptions[itemIndex % category.descriptions.length]} in ${location}. Listed for quick sale with verified details.`,
    price,
    category: category.value,
    condition,
    location,
    images: [{ url: createImage(productTitle, category.label, category.color) }],
    createdAt: `2026-04-${String(day).padStart(2, '0')}T10:00:00Z`,
    seller,
    isFeatured: itemIndex < 4
  };
}

export const MOCK_PRODUCTS: Product[] = categoryData.flatMap((_, categoryIndex) =>
  Array.from({ length: 120 }, (_, itemIndex) => createProduct(categoryIndex, itemIndex))
);
