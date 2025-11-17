
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';
import { Product } from '../../types';
import { UploadCloud } from 'lucide-react';

const ProductForm: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useStore();
  
  const isEditing = Boolean(productId);
  const initialProductState = {
    id: '',
    name: '',
    sku: '',
    price: 0,
    category: 'men' as 'men' | 'women' | 'kids',
    description: '',
    images: [] as string[],
    rating: 5,
    reviewCount: 0,
    sizes: [],
    colors: [],
    stock: 0,
    isFeatured: false,
  };

  const [product, setProduct] = useState<Product>(initialProductState);
  const [imageFiles, setImageFiles] = useState<string[]>([]);

  useEffect(() => {
    if (isEditing) {
      const existingProduct = products.find(p => p.id === productId);
      if (existingProduct) {
        setProduct(existingProduct);
        setImageFiles(existingProduct.images);
      }
    }
  }, [productId, products, isEditing]);

  // FIX: Refactored the input handler to correctly narrow the type of e.target.
  // This prevents the error when accessing the 'checked' property on checkbox inputs.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        setProduct(prev => ({ ...prev, [name]: target.checked }));
    } else {
        setProduct(prev => ({ ...prev, [name]: target.value }));
    }
  };
  
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({...prev, [name]: value.split(',').map(item => item.trim()) }));
  }

  // FIX: Replaced faulty asynchronous file reading logic with a robust Promise.all implementation.
  // This ensures all images are processed correctly before updating the state, preventing race conditions and duplicate images.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      Promise.all(files.map(fileToDataUrl))
        .then(newImageUrls => {
          setImageFiles(prev => [...prev, ...newImageUrls]);
        })
        .catch(error => {
          console.error("Error reading files:", error);
          alert("An error occurred while uploading images.");
        });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { ...product, images: imageFiles };
    if (isEditing) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    navigate('/admin/products');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="name" value={product.name} onChange={handleInputChange} placeholder="اسم المنتج" className="p-3 border rounded-md" required />
            <input name="sku" value={product.sku} onChange={handleInputChange} placeholder="SKU" className="p-3 border rounded-md" required />
        </div>
        <textarea name="description" value={product.description} onChange={handleInputChange} placeholder="وصف المنتج" rows={5} className="w-full p-3 border rounded-md"></textarea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input name="price" type="number" value={product.price} onChange={handleInputChange} placeholder="السعر" className="p-3 border rounded-md" required />
            <input name="stock" type="number" value={product.stock} onChange={handleInputChange} placeholder="المخزون" className="p-3 border rounded-md" required />
             <select name="category" value={product.category} onChange={handleInputChange} className="p-3 border rounded-md bg-white">
                <option value="men">رجالي</option>
                <option value="women">نسائي</option>
                <option value="kids">أطفال</option>
            </select>
        </div>
        <div>
            <label className="block font-medium mb-2">المقاسات (مفصولة بفاصلة)</label>
            <input name="sizes" value={product.sizes.join(', ')} onChange={handleArrayChange} placeholder="S, M, L, XL" className="w-full p-3 border rounded-md" />
        </div>
        <div>
            <label className="block font-medium mb-2">الألوان (مفصولة بفاصلة)</label>
            <input name="colors" value={product.colors.join(', ')} onChange={handleArrayChange} placeholder="أسود, أبيض, أحمر" className="w-full p-3 border rounded-md" />
        </div>
        <div>
            <label className="block font-medium mb-2">الصور</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                 <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <label htmlFor="file-upload" className="cursor-pointer text-brand-accent font-semibold">
                    <span>ارفع الملفات</span>
                    <input id="file-upload" name="images" type="file" multiple onChange={handleImageUpload} className="sr-only" />
                </label>
                 <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
                {imageFiles.map((img, index) => (
                    <img key={index} src={img} alt="preview" className="w-24 h-24 object-cover rounded-md" />
                ))}
            </div>
        </div>
        <div className="flex items-center">
            <input type="checkbox" id="isFeatured" name="isFeatured" checked={product.isFeatured} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent" />
            <label htmlFor="isFeatured" className="mr-2 block text-sm text-gray-900">منتج مميز؟</label>
        </div>
        <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/admin/products')} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition">إلغاء</button>
            <button type="submit" className="bg-brand-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition">حفظ المنتج</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;