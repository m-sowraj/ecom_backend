const ProductRepository = require('../../repos/products'); // Adjust path as needed
const { primaryDbConnection } = require('../../firebase/primarydb');
const { secondaryDbConnection } = require('../../firebase/secondarydb');
const { v4: uuidv4 } = require('uuid');

class ProductService {
  constructor() {
    this.primaryProductRepo = new ProductRepository(primaryDbConnection);
    this.secondaryProductRepo = new ProductRepository(secondaryDbConnection);
  }

  async createProduct(data) {
    data.id = uuidv4(); // Generate a unique ID for the product
    const primaryResult = await this.primaryProductRepo.createProduct(data);
    
    return { primary: primaryResult, secondary: secondaryResult };
  }

  async getProductById(productId) {
    const primaryResult = await this.primaryProductRepo.getProductById(productId);
    return primaryResult;

  }

  async getAllProducts(query) {
    const primaryResult = await this.primaryProductRepo.getAllProducts(query);
    return primaryResult;

  }

  async updateProduct(productId, updatedData) {
    const primaryResult = await this.primaryProductRepo.updateProduct(productId, updatedData);
    const secondaryResult = await this.secondaryProductRepo.updateProduct(productId, updatedData);
    
    return { primary: primaryResult, secondary: secondaryResult };
  }

  async deleteProduct(productId) {
    const primaryResult = await this.primaryProductRepo.deleteProduct(productId);
    const secondaryResult = await this.secondaryProductRepo.deleteProduct(productId);

    return { primary: primaryResult, secondary: secondaryResult };
  }

  //getCategoryById
  async getCategoryById(categoryId) {
    const primaryResult = await this.primaryProductRepo.getCategoryById(categoryId);
    return primaryResult;

  }
}

module.exports = new ProductService();
