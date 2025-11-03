const Product = require('../models/Product.model');
const ErrorResponse = require('../utils/errorResponse');

class ProductService {
  /**
   * Create a new product
   */
  async createProduct(productData) {
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
    const product = await Product.findById(productId).populate('user', 'name email');
    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }
    return product;
  }

  /**
   * Update product
   */
  async updateProduct(productId, updateData) {
    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }

    return product;
  }

  /**
   * Delete product
   */
  async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }
    return true;
  }

  /**
   * Add product review
   */
  async addProductReview(productId, userId, reviewData) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      throw new ErrorResponse('Product already reviewed', 400);
    }

    const review = {
      user: userId,
      name: reviewData.name,
      rating: Number(reviewData.rating),
      comment: reviewData.comment,
    };

    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;

    // Calculate average rating
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    return product;
  }
}

module.exports = new ProductService();

