import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import ProductCard from '../components/ProductCard';
import { Truck, ShieldCheck, RotateCw } from 'lucide-react';

const HomePage: React.FC = () => {
  const { products, themeSettings } = useStore();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const { hero, featuredProductsTitle, features, categoryImages } = themeSettings;

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="bg-cover bg-center h-[500px] flex items-center justify-center text-white" 
        style={{ backgroundImage: `url('${hero.imageUrl}')` }}
      >
        <div className="text-center bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-5xl font-black mb-4 tracking-wide">{hero.headline}</h1>
          <p className="text-lg mb-8">{hero.subheading}</p>
          <Link 
            to="/category/all" 
            className="bg-brand-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 text-lg"
          >
            {hero.ctaText}
          </Link>
        </div>
      </section>

      {/* Category Links */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Link to="/category/men" className="block group relative">
                    <img src={categoryImages.men} alt="Men's Collection" className="w-full h-80 object-cover rounded-lg shadow-md"/>
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                        <h2 className="text-white text-3xl font-bold transform group-hover:scale-105 transition-transform">رجالي</h2>
                    </div>
                </Link>
                <Link to="/category/women" className="block group relative">
                    <img src={categoryImages.women} alt="Women's Collection" className="w-full h-80 object-cover rounded-lg shadow-md"/>
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                        <h2 className="text-white text-3xl font-bold transform group-hover:scale-105 transition-transform">نسائي</h2>
                    </div>
                </Link>
                <Link to="/category/kids" className="block group relative">
                    <img src={categoryImages.kids} alt="Kids' Collection" className="w-full h-80 object-cover rounded-lg shadow-md"/>
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                        <h2 className="text-white text-3xl font-bold transform group-hover:scale-105 transition-transform">أطفال</h2>
                    </div>
                </Link>
            </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">{featuredProductsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

       {/* Features Bar */}
      <section className="bg-white py-12 border-t border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <Truck size={48} className="text-brand-accent mb-4"/>
                    <h3 className="text-xl font-bold mb-2">{features[0].title}</h3>
                    <p className="text-gray-600">{features[0].description}</p>
                </div>
                <div className="flex flex-col items-center">
                    <ShieldCheck size={48} className="text-brand-accent mb-4"/>
                    <h3 className="text-xl font-bold mb-2">{features[1].title}</h3>
                    <p className="text-gray-600">{features[1].description}</p>
                </div>
                <div className="flex flex-col items-center">
                    <RotateCw size={48} className="text-brand-accent mb-4"/>
                    <h3 className="text-xl font-bold mb-2">{features[2].title}</h3>
                    <p className="text-gray-600">{features[2].description}</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;