# 🚀 خطوات نشر متجر NUMBER 6 على Vercel

## 📋 المتطلبات
1. حساب GitHub
2. حساب Vercel
3. حساب MongoDB Atlas
4. حساب Stripe
5. حساب Gmail (للإيميلات)

## 🗂️ الخطوات بالترتيب

### 1️⃣ إعداد قاعدة البيانات (MongoDB Atlas)
1. اذهب إلى [MongoDB Atlas](https://cloud.mongodb.com/)
2. اعمل حساب جديد
3. أنشئ cluster مجاني
4. أنشئ database user
5. اضبط Network Access (أضف IP: 0.0.0.0)
6. احصل على connection string

### 2️⃣ إعداد Stripe
1. اذهب إلى [Stripe Dashboard](https://dashboard.stripe.com/)
2. اعمل حساب جديد
3. احصل على API Keys من Developers → API keys
4. خد الـ Publishable Key والـ Secret Key

### 3️⃣ رفع الكود على GitHub
1. افتح Terminal في مجلد المشروع
2. اكتب الأوامر دي:
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/username/number6-store.git
git push -u origin main
```

### 4️⃣ النشر على Vercel
1. اذهب إلى [Vercel](https://vercel.com/)
2. سجل بحساب GitHub بتاعك
3. اضغط "Add New" → "Project"
4. اختر repository بتاعك
5. Vercel هتعرف إنه React project تلقائياً

### 5️⃣ إعدادات Environment Variables في Vercel
1. في Vercel Dashboard، اذهب لـ Settings → Environment Variables
2. أضف المتغيرات دي:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/number6-store
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-password
NODE_ENV=production
```

### 6️⃣ إعداد Gmail للإيميلات
1. فعل 2-Step Verification في Gmail
2. اذهب إلى Google Account → Security → App passwords
3. اعمل app password جديد
4. استخدمه في EMAIL_PASS

### 7️⃣ النشر النهائي
1. اضغط "Deploy" في Vercel
2. استنى شوية لما البناء يخلص
3. هيديك رابط مثل: your-app.vercel.app

## 🔧 بعد النشر

### اختبار الموقع
1. افتح الرابط اللي Vercel عطاك إياه
2. اختبر كل الصفحات
3. جرب تعمل طلب تجريبي
4. تأكد إن لوحة التحكم شغالة

### لوحة التحكم
1. اذهب إلى: your-app.vercel.app/admin
2. استخدم كلمة المرور اللي حطيتها في ADMIN_PASSWORD

## 🆘 مشاكل شائعة

### لو الصفحات مش بتفتح
- تأكد إن Environment Variables كلها مظبوطة
- تأكد إن MongoDB connection صحيح

### لو الطلبات مش بتوصل
- تأكد من إعدادات Stripe
- تأكد من إعدادات Gmail

### لو لوحة التحكم مش بتفتح
- تأكد من كلمة المرور في ADMIN_PASSWORD
- تأكد إنك بستخدم الرابط الصحيح

## 📞 مساعدة
لو في أي مشكلة، ممكن تراسلني أو تسأل في Vercel Docs.

## 🎉 مبروك!
متجرك الإلكتروني جاهز الآن على الإنترنت! 🛍️
