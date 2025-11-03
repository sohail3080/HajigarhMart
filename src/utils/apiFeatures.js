/**
 * API Features class for common query operations
 * Handles search, filter, pagination, and sorting
 */
class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Search feature
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i', // case insensitive
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filter feature
  filter() {
    const queryCopy = { ...this.queryStr };

    // Remove fields that are not for filtering
    const removeFields = ['keyword', 'page', 'limit', 'sort'];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Advanced filter for price, ratings etc
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Pagination feature
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }

  // Sort feature
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
}

module.exports = APIFeatures;

