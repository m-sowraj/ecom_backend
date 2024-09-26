const ProductVarientRepository = require('../../repos/ProductVarients'); // Adjust path as needed
const { primaryDbConnection } = require('../../firebase/primarydb');
const { secondaryDbConnection } = require('../../firebase/secondarydb');
const { v4: uuidv4 } = require('uuid');

class ProductVarientService {
  constructor() {
    this.primaryProductVarientRepo = new ProductVarientRepository(primaryDbConnection);
    this.secondaryProductVarientRepo = new ProductVarientRepository(secondaryDbConnection);
  }

  async createProductVarient(data) {
    data.id = uuidv4(); // Generate a unique ID for the ProductVarient
    const primaryResult = await this.primaryProductVarientRepo.createProductVarient(data);
    const secondaryResult = await this.secondaryProductVarientRepo.createProductVarient(data);
    
    return { primary: primaryResult, secondary: secondaryResult };
  }

  async getProductVarientById(ProductVarientId) {
    const primaryResult = await this.primaryProductVarientRepo.getProductVarientById(ProductVarientId);
    return primaryResult;

  }

  async getAllProductVarients(query) {
    const primaryResult = await this.primaryProductVarientRepo.getAllProductVarients(query);
    return primaryResult;

  }

  async updateProductVarient(ProductVarientId, updatedData) {
    const primaryResult = await this.primaryProductVarientRepo.updateProductVarient(ProductVarientId, updatedData);
    const secondaryResult = await this.secondaryProductVarientRepo.updateProductVarient(ProductVarientId, updatedData);
    
    return { primary: primaryResult, secondary: secondaryResult };
  }

  async deleteProductVarient(ProductVarientId) {
    const primaryResult = await this.primaryProductVarientRepo.deleteProductVarient(ProductVarientId);
    const secondaryResult = await this.secondaryProductVarientRepo.deleteProductVarient(ProductVarientId);

    return { primary: primaryResult, secondary: secondaryResult };
  }

  //getCategoryById
  async getCategoryById(categoryId) {
    const primaryResult = await this.primaryProductVarientRepo.getCategoryById(categoryId);
    return primaryResult;

  }
}

module.exports = new ProductVarientService();
