import { Product } from '../models/product.models';
import { INDIAN_STATES } from '../constants/indian-states';

const categoryData = [
  {
    value: 'mobiles',
    label: 'Mobiles',
    titles: ['iPhone 14 128GB', 'Samsung Galaxy S23', 'OnePlus 12R', 'Google Pixel 8', 'Redmi Note 13 Pro', 'Vivo V30'],
    descriptions: ['Original bill available', 'Single owner device', 'Box and charger included', 'Battery health checked'],
    color: '#1565c0',
    imageUrls: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=900&q=80'
    ],
    minPrice: 8500,
    step: 750
  },
  {
    value: 'cars',
    label: 'Cars',
    titles: ['Maruti Swift', 'Hyundai i20', 'Tata Nexon', 'Honda City', 'Mahindra XUV300', 'Toyota Glanza'],
    descriptions: ['Insurance active', 'Service history available', 'Clean car interior', 'Recently serviced'],
    color: '#2e7d32',
    imageUrls: [
      'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80'
    ],
    minPrice: 185000,
    step: 8500
  },
  {
    value: 'electronics',
    label: 'Electronics',
    titles: ['Sony Bravia TV', 'Dell Inspiron Laptop', 'Canon DSLR Camera', 'JBL Soundbar', 'Apple iPad', 'LG Washing Machine'],
    descriptions: ['Works perfectly', 'Demo available before purchase', 'Clean condition', 'Accessories included'],
    color: '#6a1b9a',
    imageUrls: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80'
    ],
    minPrice: 4500,
    step: 640
  },
  {
    value: 'furniture',
    label: 'Furniture',
    titles: ['Sofa Set 3+1+1', 'Queen Size Bed', 'Dining Table Set', 'Study Desk', 'Office Chair', 'Wardrobe'],
    descriptions: ['Well maintained', 'Ready to move', 'No major scratches', 'Ideal for home setup'],
    color: '#795548',
    imageUrls: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80'
    ],
    minPrice: 2800,
    step: 520
  },
  {
    value: 'fashion',
    label: 'Fashion',
    titles: ['Leather Jacket', 'Designer Saree', 'Sneakers', 'Formal Blazer', 'Smart Watch', 'Travel Backpack'],
    descriptions: ['Lightly used', 'Freshly cleaned', 'Premium material', 'Great everyday pick'],
    color: '#c2185b',
    imageUrls: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'
    ],
    minPrice: 700,
    step: 180
  },
  {
    value: 'property',
    label: 'Property',
    titles: ['1 BHK Apartment', '2 BHK Flat', 'Commercial Shop', 'Studio Room', 'PG Room', 'Warehouse Space'],
    descriptions: ['Prime locality', 'Broker-free listing', 'Ready for visit', 'Good connectivity'],
    color: '#ef6c00',
    imageUrls: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=900&q=80'
    ],
    minPrice: 6500,
    step: 1250
  }
] as const;

const conditions: Product['condition'][] = ['new', 'like-new', 'good', 'fair'];
const sellers = [
  { id: 'seller-1', name: 'Rahul Kumar', rating: 4.8, totalListings: 42, responseTime: '2 hours', phone: '+91-98765-43210', email: 'rahul@recommerce.com' },
  { id: 'seller-2', name: 'Ananya Singh', rating: 4.9, totalListings: 58, responseTime: '1 hour', phone: '+91-97654-32109', email: 'ananya@recommerce.com' },
  { id: 'seller-3', name: 'Vikram Patel', rating: 4.6, totalListings: 35, responseTime: '3 hours', phone: '+91-96543-21098', email: 'vikram@recommerce.com' },
  { id: 'seller-4', name: 'Meera Desai', rating: 4.7, totalListings: 51, responseTime: '2 hours', phone: '+91-95432-10987', email: 'meera@recommerce.com' },
  { id: 'seller-5', name: 'Arjun Sharma', rating: 4.5, totalListings: 28, responseTime: '4 hours', phone: '+91-94321-09876', email: 'arjun@recommerce.com' },
  { id: 'buyer-1', name: 'Demo Buyer', rating: 4.0, totalListings: 5, responseTime: '1 day', phone: '+91-93210-98765', email: 'demo@recommerce.com' }
];

function createImage(title: string, categoryLabel: string, color: string, icon: string, imageUrl?: string) {
  if (imageUrl) {
    return imageUrl;
  }

  // Create a canvas-based image that will definitely render
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  
  if (canvas) {
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;
    
    // Background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Icon circle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(80, 80, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Icon text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, 80, 80);
    
    // Title
    ctx.font = 'bold 24px Arial';
    ctx.fillText(categoryLabel, canvas.width / 2, 160);
    
    // Item name
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const itemName = title.substring(0, 30);
    ctx.fillText(itemName, canvas.width / 2, 200);
    
    // Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(10, canvas.height - 40, canvas.width - 20, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('✓ Verified Listing', 20, canvas.height - 20);
    
    return canvas.toDataURL('image/png');
  }
  
  // Fallback: Use placeholder service that works without canvas
  const encodedTitle = encodeURIComponent(categoryLabel);
  return `https://via.placeholder.com/400x300/${color.substring(1)}?text=${encodedTitle}+${icon}`;
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

  // Category icons
  const categoryIcons: Record<string, string> = {
    mobiles: '📱',
    cars: '🚗',
    electronics: '🖥️',
    furniture: '🛋️',
    fashion: '👔',
    property: '🏠'
  };

  const icon = categoryIcons[category.value] || '📦';

  // Generate 2-4 images per product
  const imageCount = 2 + (itemIndex % 3);
  const images = Array.from({ length: imageCount }, (_, i) => ({
    url: createImage(productTitle, category.label, category.color, icon, category.imageUrls[(itemIndex + i) % category.imageUrls.length]),
    uploadedAt: `2026-04-${String(day).padStart(2, '0')}T${10 + i}:00:00Z`
  }));

  return {
    id: `${category.value}-${itemIndex + 1}`,
    title: productTitle,
    description: `${category.descriptions[itemIndex % category.descriptions.length]} in ${location}. Listed for quick sale with verified details.`,
    price,
    category: category.value,
    condition,
    location,
    images,
    createdAt: `2026-04-${String(day).padStart(2, '0')}T10:00:00Z`,
    updatedAt: `2026-04-${String(day).padStart(2, '0')}T10:00:00Z`,
    seller,
    isFeatured: itemIndex < 4,
    isActive: true
  };
}

export const MOCK_PRODUCTS: Product[] = categoryData.flatMap((_, categoryIndex) =>
  Array.from({ length: 120 }, (_, itemIndex) => createProduct(categoryIndex, itemIndex))
);
