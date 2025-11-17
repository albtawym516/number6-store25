import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Star, Share2 } from 'lucide-react';

const Rating: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => (
    <div className="flex items-center">
      <div className="flex items-center text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={20} fill={i < Math.round(rating) ? 'currentColor' : 'none'} />
        ))}
      </div>
      <span className="text-gray-600 text-md mr-2">({reviewCount} مراجعة)</span>
    </div>
);

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const product = products.find(p => p.id === productId);

  const [mainImage, setMainImage] = useState(product?.images[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return <div className="text-center py-20">المنتج غير موجود.</div>;
  }
  
  const handleAddToCart = () => {
    addToCart({ product, quantity, size: selectedSize, color: selectedColor });
    alert(`تمت إضافة ${quantity} من ${product.name} إلى السلة`);
  };

  const handleBuyNow = () => {
    addToCart({ product, quantity, size: selectedSize, color: selectedColor });
    navigate('/checkout');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`شاهد هذا المنتج الرائع: ${product.name} - ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="border rounded-lg mb-4 overflow-hidden">
              <img src={mainImage} alt={product.name} className="w-full h-auto object-cover" />
            </div>
            <div className="flex space-x-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-brand-accent' : 'border-transparent'}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>
          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-4">SKU: {product.sku}</p>
            <div className="mb-4">
               <Rating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
            <div className="flex items-baseline mb-6">
              {product.salePrice ? (
                <>
                  <p className="text-3xl font-bold text-brand-accent">{product.salePrice} جنيه</p>
                  <p className="text-lg text-gray-500 line-through mr-3">{product.price} جنيه</p>
                </>
              ) : (
                <p className="text-3xl font-bold text-gray-900">{product.price} جنيه</p>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
            
            {/* Size Options */}
            <div className="mb-6">
              <h3 className="font-bold mb-2">المقاس:</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-md transition ${selectedSize === size ? 'bg-gray-900 text-white border-gray-900' : 'bg-white hover:border-gray-900'}`}>{size}</button>
                ))}
              </div>
            </div>

            {/* Color Options */}
            <div className="mb-6">
              <h3 className="font-bold mb-2">اللون:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 border rounded-md transition ${selectedColor === color ? 'bg-gray-900 text-white border-gray-900' : 'bg-white hover:border-gray-900'}`}>{color}</button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center mb-8">
              <h3 className="font-bold ml-4">الكمية:</h3>
              <div className="flex items-center border rounded-md">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-lg">-</button>
                <span className="px-4 py-2 text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-lg">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex flex-col sm:flex-row gap-4">
              <button onClick={handleAddToCart} className="flex-1 bg-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition">أضف إلى السلة</button>
              <button onClick={handleBuyNow} className="flex-1 bg-gray-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition">اشترِ الآن</button>
            </div>

             {/* Share Button */}
             <button onClick={shareOnWhatsApp} className="mt-6 flex items-center justify-center text-gray-600 hover:text-brand-accent transition">
                <Share2 size={20} className="ml-2"/>
                <span>مشاركة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg z-30">
        <button onClick={handleAddToCart} className="w-full bg-brand-accent text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition">
          أضف إلى السلة
        </button>
      </div>
    </>
  );
};

export default ProductDetailPage;
