const Product = require('../models/Product.model');
const ErrorResponse = require('../utils/errorResponse');

class ProductService {
  /**
   * Create a new product
   */
  async createProduct(productData, userId) {
    // Verify shop ownership
    const Shop = require('../models/Shop.model');
    const shop = await Shop.findById(productData.shop);
    
    if (!shop) {
      throw new ErrorResponse('Shop not found', 404);
    }

    if (shop.owner.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized to add products to this shop', 403);
    }

    const product = await Product.create(productData);
    return product;
  }

  /**
   * Get all products with filtering, sorting, and pagination
   */
  async getAllProducts(queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Filter by category
    if (queryParams.category) {
      query.category = queryParams.category;
    }

    // Filter by price range
    if (queryParams.minPrice || queryParams.maxPrice) {
      query.price = {};
      if (queryParams.minPrice) query.price.$gte = Number(queryParams.minPrice);
      if (queryParams.maxPrice) query.price.$lte = Number(queryParams.maxPrice);
    }

    // Search by name
    if (queryParams.search) {
      query.name = { $regex: queryParams.search, $options: 'i' };
    }

    // Only active products for non-admin users
    query.isActive = true;

    // Execute query
    let productsQuery = Product.find(query);

    // Sort
    if (queryParams.sort) {
      const sortBy = queryParams.sort.split(',').join(' ');
      productsQuery = productsQuery.sort(sortBy);
    } else {
      productsQuery = productsQuery.sort('-createdAt');
    }

    // Pagination
    productsQuery = productsQuery.skip(skip).limit(limit);

    const products = await productsQuery;
    const total = await Product.countDocuments(query);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get product by ID
   */
  async getProductById(productId) {
    const product = await Product.findById(productId).populate('shop', 'name address');
    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }
    return product;
  }

  /**
   * Get shop products
   */
  async getShopProducts(shopId, queryParams) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = { shop: shopId, isActive: true };

    // Search by name
    if (queryParams.search) {
      query.name = { $regex: queryParams.search, $options: 'i' };
    }

    // Filter by category
    if (queryParams.category) {
      query.category = queryParams.category;
    }

    const products = await Product.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update product
   */
  async updateProduct(productId, updateData, userId) {
    const product = await Product.findById(productId).populate('shop');
    
    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }

    // Check shop ownership
    if (product.shop.owner.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized to update this product', 403);
    }

    Object.assign(product, updateData);
    await product.save();

    return product;
  }

  /**
   * Delete product
   */
  async deleteProduct(productId, userId) {
    const product = await Product.findById(productId).populate('shop');
    
    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }

    // Check shop ownership
    if (product.shop.owner.toString() !== userId.toString()) {
      throw new ErrorResponse('Not authorized to delete this product', 403);
    }

    await Product.findByIdAndDelete(productId);
    return true;
  }

}

module.exports = new ProductService();

