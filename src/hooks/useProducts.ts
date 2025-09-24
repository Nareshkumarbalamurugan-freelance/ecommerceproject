import { useState, useEffect } from 'react';
import { Product } from '../types';
import product1Image from '../assets/product-1.jpg';
import product2Image from '../assets/product-2.jpg';
import product3Image from '../assets/product-3.jpg';

// Default products data
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Pink Ethnic Kurta',
    description: 'Beautiful pink ethnic wear kurta perfect for festivals and occasions. Made with high-quality cotton fabric.',
    price: 899,
    originalPrice: 1299,
    image: product1Image,
    category: 'Women\'s Clothing',
    rating: 4.5,
    reviews: 124,
    inStock: true,
    discount: 31
  },
  {
    id: '2',
    name: 'Casual Blue Shirt',
    description: 'Stylish men\'s casual shirt in premium blue color. Perfect for office or casual outings.',
    price: 599,
    originalPrice: 799,
    image: product2Image,
    category: 'Men\'s Clothing',
    rating: 4.2,
    reviews: 89,
    inStock: true,
    discount: 25
  },
  {
    id: '3',
    name: 'Trendy White Pink Sneakers',
    description: 'Comfortable and stylish sneakers in white and pink combination. Perfect for daily wear.',
    price: 1299,
    originalPrice: 1699,
    image: product3Image,
    category: 'Footwear',
    rating: 4.7,
    reviews: 203,
    inStock: true,
    discount: 24
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from localStorage or use defaults
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    setLoading(false);
  }, []);

  // Save products to localStorage whenever products change
  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    const updatedProducts = [...products, newProduct];
    updateProducts(updatedProducts);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, ...updates } : product
    );
    updateProducts(updatedProducts);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    updateProducts(updatedProducts);
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    searchProducts
  };
};