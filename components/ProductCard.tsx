
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Star, ShoppingCart } from 'lucide-react';
import { useStore } from '../hooks/useStore';

interface ProductCardProps {
  product: Product;
}

const Rating: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => (
  <div className="flex items-center">
    <div className="flex items-center text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} fill={i < Math.round(rating) ? 'currentColor' : 'none'} />
      ))}
    </div>
    <span className="text-gray-500 text-sm mr-2">({reviewCount})</span>
  </div>
);

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product: product,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
    });
    alert(`${product.name} أضيف إلى السلة!`);
  };
  
  return (
    <Link to={`/product/${product.id}`} className="group block overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-center bg-brand-accent text-white py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
             <ShoppingCart size={20} className="ml-2"/> أضف إلى السلة
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
        <div className="flex items-baseline mb-2">
          {product.salePrice ? (
            <>
              <p className="text-xl font-bold text-brand-accent">{product.salePrice} جنيه</p>
              <p className="text-sm text-gray-500 line-through mr-2">{product.price} جنيه</p>
            </>
          ) : (
            <p className="text-xl font-bold text-gray-800">{product.price} جنيه</p>
          )}
        </div>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
      </div>
    </Link>
  );
};

export default ProductCard;
