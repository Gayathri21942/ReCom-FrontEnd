export interface ProductImage {
  id?: string;
  url: string;
  uploadedAt?: string;
}

export interface ProductSeller {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  rating?: number;
  totalListings?: number;
  responseTime?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  location: string;
  images: ProductImage[];
  createdAt: string;
  updatedAt?: string;
  seller: ProductSeller;
  isFeatured?: boolean;
  isActive?: boolean;
  soldAt?: string; // ISO timestamp when product was sold
}

export interface ProductPayload {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  images: ProductImage[];
  isActive?: boolean;
}

export interface ProductFilters {
  query: string;
  category: string;
  location: string;
  minPrice: number | null;
  maxPrice: number | null;
  pageIndex: number;
  pageSize: number;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
}
