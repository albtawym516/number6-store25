// Validation middleware for server endpoints

const validateProduct = (req, res, next) => {
  const { name, sku, price, category, description, images, sizes, colors, stock } = req.body;
  
  const errors = [];
  
  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    errors.push('Product name is required and must be at least 3 characters long');
  }
  
  if (!sku || typeof sku !== 'string' || sku.trim().length < 3) {
    errors.push('Product SKU is required and must be at least 3 characters long');
  }
  
  if (!price || typeof price !== 'number' || price <= 0) {
    errors.push('Product price is required and must be a positive number');
  }
  
  if (!category || !['men', 'women', 'kids'].includes(category)) {
    errors.push('Product category is required and must be one of: men, women, kids');
  }
  
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Product description is required and must be at least 10 characters long');
  }
  
  if (!images || !Array.isArray(images) || images.length === 0) {
    errors.push('Product images are required and must be an array with at least one image');
  }
  
  if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
    errors.push('Product sizes are required and must be an array with at least one size');
  }
  
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    errors.push('Product colors are required and must be an array with at least one color');
  }
  
  if (typeof stock !== 'number' || stock < 0) {
    errors.push('Product stock is required and must be a non-negative number');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }
  
  next();
};

const validateOrder = (req, res, next) => {
  const { items, total, shippingInfo } = req.body;
  
  const errors = [];
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Order items are required and must be an array with at least one item');
  } else {
    items.forEach((item, index) => {
      if (!item.product || !item.quantity || !item.size || !item.color) {
        errors.push(`Item ${index + 1} is missing required fields (product, quantity, size, color)`);
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push(`Item ${index + 1} quantity must be a positive number`);
      }
    });
  }
  
  if (!total || typeof total !== 'number' || total <= 0) {
    errors.push('Order total is required and must be a positive number');
  }
  
  if (!shippingInfo) {
    errors.push('Shipping information is required');
  } else {
    const { fullName, email, phone, address, city, country } = shippingInfo;
    
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
      errors.push('Full name is required and must be at least 3 characters long');
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Valid email address is required');
    }
    
    if (!phone || !/^01[0-9]{9}$/.test(phone.replace(/\s/g, ''))) {
      errors.push('Valid Egyptian phone number is required (format: 01xxxxxxxxx)');
    }
    
    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      errors.push('Address is required and must be at least 5 characters long');
    }
    
    if (!city || typeof city !== 'string' || city.trim().length < 2) {
      errors.push('City is required and must be at least 2 characters long');
    }
    
    if (!country || typeof country !== 'string' || country.trim().length < 2) {
      errors.push('Country is required and must be at least 2 characters long');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }
  
  next();
};

const validatePaymentIntent = (req, res, next) => {
  const { amount } = req.body;
  
  const errors = [];
  
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    errors.push('Payment amount is required and must be a positive number');
  }
  
  if (amount > 1000000) { // 10,000 EGP in cents
    errors.push('Payment amount exceeds maximum limit');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }
  
  next();
};

const validateAuth = (req, res, next) => {
  const { password } = req.body;
  
  const errors = [];
  
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors 
    });
  }
  
  next();
};

module.exports = {
  validateProduct,
  validateOrder,
  validatePaymentIntent,
  validateAuth
};
