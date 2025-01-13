const ProductRepository = require('../../repos/ProductVarients');
const { getDbConnection } = require('../../firebase/dbConfig');
const { v4: uuidv4 } = require('uuid');

class ProductService {
  constructor() {
    this.productRepo = null;
  }

  // Initialize repository with correct database connection
  initializeRepo(companyId) {
    const dbConnection = getDbConnection(companyId);
    this.productRepo = new ProductRepository(dbConnection);
  }

  async createProduct(data) {
    this.initializeRepo(data.company_id);
    data.id = uuidv4();
    const result = await this.productRepo.createProductvarient(data);
    return result;
  }

  async getProductById(productId, companyId) {
    this.initializeRepo(companyId);
    const result = await this.productRepo.getProductvarientById(productId);
    return result;
  }

  async getAllProducts(query) {
    this.initializeRepo(query.company_id);
    const result = await this.productRepo.getAllProductvarients(query);
    return result;
  }

  async updateProduct(productId, updatedData, companyId) {
    this.initializeRepo(companyId);
    const result = await this.productRepo.updateProductvarient(productId, updatedData);
    return result;
  }

  async deleteProduct(productId, companyId) {
    this.initializeRepo(companyId);
    const result = await this.productRepo.deleteProductvarient(productId);
    return result;
  }

  //getCategoryById
  async getCategoryById(categoryId, companyId) {
    this.initializeRepo(companyId);
    const result = await this.productRepo.getCategoryById(categoryId);
    return result;
  }
}

module.exports = new ProductService();
