import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { ThemeSettings as ThemeSettingsType } from '../../types';
import { Upload } from 'lucide-react';

const ThemeSettings: React.FC = () => {
    const { themeSettings, updateThemeSettings } = useStore();
    const [settings, setSettings] = useState<ThemeSettingsType>(themeSettings);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({...prev, [name]: value}));
    };

    const handleNestedInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: 'hero' | 'features', key?: string | number) => {
        const { name, value } = e.target;
        if (section === 'hero') {
            setSettings(prev => ({
                ...prev,
                hero: { ...prev.hero, [name]: value }
            }));
        } else if (section === 'features' && typeof key === 'number') {
             const newFeatures = [...settings.features] as ThemeSettingsType['features'];
             newFeatures[key] = { ...newFeatures[key], [name]: value };
             setSettings(prev => ({ ...prev, features: newFeatures }));
        }
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, section: 'hero' | 'categoryImages', key?: 'men' | 'women' | 'kids') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImageUrl = reader.result as string;
                if (section === 'hero') {
                    setSettings(prev => ({
                        ...prev,
                        hero: { ...prev.hero, imageUrl: newImageUrl }
                    }));
                } else if (section === 'categoryImages' && key) {
                    setSettings(prev => ({
                        ...prev,
                        categoryImages: { ...prev.categoryImages, [key]: newImageUrl }
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateThemeSettings(settings);
        alert('تم حفظ الإعدادات بنجاح!');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">إعدادات الواجهة</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-8">

                {/* General Settings */}
                <div className="border-b pb-6">
                    <h2 className="text-xl font-semibold mb-4">الإعدادات العامة</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-medium mb-2">شريط الإعلانات العلوي</label>
                            <input name="announcementText" value={settings.announcementText} onChange={handleInputChange} className="w-full p-3 border rounded-md" />
                        </div>
                        <div className="flex items-end">
                             <div className="w-full">
                                <label className="block font-medium mb-2">اللون الأساسي</label>
                                <input name="accentColor" type="text" value={settings.accentColor} onChange={handleInputChange} className="w-full p-3 border rounded-md" />
                            </div>
                             <input type="color" value={settings.accentColor} onChange={handleInputChange} name="accentColor" className="h-[46px] w-12 p-1 border rounded-md cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="border-b pb-6">
                    <h2 className="text-xl font-semibold mb-4">قسم الهيرو (البانر الرئيسي)</h2>
                    <div className="space-y-4">
                        <input name="headline" value={settings.hero.headline} onChange={(e) => handleNestedInputChange(e, 'hero')} placeholder="العنوان الرئيسي" className="w-full p-3 border rounded-md" />
                        <textarea name="subheading" value={settings.hero.subheading} onChange={(e) => handleNestedInputChange(e, 'hero')} placeholder="العنوان الفرعي" className="w-full p-3 border rounded-md" rows={2}></textarea>
                        
                        <div>
                            <label className="block font-medium mb-2">صورة الخلفية</label>
                            <div className="flex items-center gap-4">
                                <img src={settings.hero.imageUrl} alt="معاينة البانر" className="w-48 h-24 object-cover rounded-md border bg-gray-100" />
                                <label className="flex-1 cursor-pointer flex items-center justify-center p-3 border-2 border-dashed rounded-md text-gray-500 hover:border-brand-accent hover:text-brand-accent">
                                    <Upload size={20} className="ml-2"/>
                                    <span>تغيير الصورة</span>
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero')} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <input name="ctaText" value={settings.hero.ctaText} onChange={(e) => handleNestedInputChange(e, 'hero')} placeholder="نص زر الحث على الشراء" className="w-full p-3 border rounded-md" />
                    </div>
                </div>
                
                {/* Category Images */}
                <div className="border-b pb-6">
                    <h2 className="text-xl font-semibold mb-4">صور الأقسام</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block font-medium mb-2">صورة قسم الرجال</label>
                            <img src={settings.categoryImages.men} alt="معاينة قسم الرجال" className="w-full h-40 object-cover rounded-md border mb-2 bg-gray-100" />
                            <label className="w-full cursor-pointer flex items-center justify-center p-2 border-2 border-dashed rounded-md text-gray-500 hover:border-brand-accent hover:text-brand-accent">
                                <Upload size={16} className="ml-2"/>
                                <span>تغيير الصورة</span>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'categoryImages', 'men')} className="hidden" />
                            </label>
                        </div>
                        <div>
                            <label className="block font-medium mb-2">صورة قسم النساء</label>
                            <img src={settings.categoryImages.women} alt="معاينة قسم النساء" className="w-full h-40 object-cover rounded-md border mb-2 bg-gray-100" />
                            <label className="w-full cursor-pointer flex items-center justify-center p-2 border-2 border-dashed rounded-md text-gray-500 hover:border-brand-accent hover:text-brand-accent">
                                <Upload size={16} className="ml-2"/>
                                <span>تغيير الصورة</span>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'categoryImages', 'women')} className="hidden" />
                            </label>
                        </div>
                        <div>
                            <label className="block font-medium mb-2">صورة قسم الأطفال</label>
                            <img src={settings.categoryImages.kids} alt="معاينة قسم الأطفال" className="w-full h-40 object-cover rounded-md border mb-2 bg-gray-100" />
                             <label className="w-full cursor-pointer flex items-center justify-center p-2 border-2 border-dashed rounded-md text-gray-500 hover:border-brand-accent hover:text-brand-accent">
                                <Upload size={16} className="ml-2"/>
                                <span>تغيير الصورة</span>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'categoryImages', 'kids')} className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>


                {/* Featured Products */}
                <div>
                     <h2 className="text-xl font-semibold mb-4">قسم المنتجات المختارة</h2>
                     <input name="featuredProductsTitle" value={settings.featuredProductsTitle} onChange={handleInputChange} placeholder="عنوان القسم" className="w-full p-3 border rounded-md" />
                </div>

                {/* Features Bar */}
                <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">شريط المزايا</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {settings.features.map((feature, index) => (
                            <div key={index} className="space-y-2 bg-gray-50 p-4 rounded-md">
                                <label className="font-medium text-sm">الميزة #{index + 1}</label>
                                <input name="title" value={feature.title} onChange={(e) => handleNestedInputChange(e, 'features', index)} placeholder="عنوان الميزة" className="w-full p-2 border rounded-md" />
                                <input name="description" value={feature.description} onChange={(e) => handleNestedInputChange(e, 'features', index)} placeholder="وصف الميزة" className="w-full p-2 border rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-brand-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition">
                        حفظ الإعدادات
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ThemeSettings;