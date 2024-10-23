const ProductRepository = require('../../repos/ProductVarients'); // Adjust path as needed
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
    const primaryResult = await this.primaryProductRepo.createProductvarient(data);
    const secondaryResult = await this.secondaryProductRepo.createProductvarient(data);
    
    return { primary: primaryResult, secondary: secondaryResult };
  }

  async getProductById(productId) {
    const primaryResult = await this.primaryProductRepo.getProductvarientById(productId);
    return primaryResult;

  }

  async getAllProducts(query) {
    const primaryResult = await this.primaryProductRepo.getAllProductvarients(query);
    return primaryResult;

  }

  async updateProduct(productId, updatedData) {
    const primaryResult = await this.primaryProductRepo.updateProductvarient(productId, updatedData);
    const secondaryResult = await this.secondaryProductRepo.updateProductvarient(productId, updatedData);
    
    return { primary: primaryResult, secondary: secondaryResult };
  }

  async deleteProduct(productId) {
    const primaryResult = await this.primaryProductRepo.deleteProductvarient(productId);
    const secondaryResult = await this.secondaryProductRepo.deleteProductvarient(productId);

    return { primary: primaryResult, secondary: secondaryResult };
  }

  //getCategoryById
  async getCategoryById(categoryId) {
    const primaryResult = await this.primaryProductRepo.getCategoryById(categoryId);
    return primaryResult;

  }
}

module.exports = new ProductService();
