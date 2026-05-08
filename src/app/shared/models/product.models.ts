export interface ProductImage {
  id?: string;
  url: string;
}

export interface ProductSeller {
  id: string;
  name: string;
  phone?: string;
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
  seller: ProductSeller;
  isFeatured?: boolean;
}

export interface ProductPayload {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  images: ProductImage[];
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
