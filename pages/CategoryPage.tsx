
import React from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import ProductCard from '../components/ProductCard';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { products } = useStore();

  const categoryMap: { [key: string]: string } = {
    men: 'رجالي',
    women: 'نسائي',
    kids: 'أطفال',
    all: 'كل المنتجات'
  };

  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);
  
  const categoryName = category ? categoryMap[category] : 'المنتجات';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">{categoryName}</h1>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">لا توجد منتجات في هذا القسم حاليًا.</p>
      )}
    </div>
  );
};

export default CategoryPage;
