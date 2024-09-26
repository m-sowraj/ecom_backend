const CategoryRepository = require('../../repos/product_category');
const { primaryDbConnection} = require('../../firebase/primarydb');
const { secondaryDbConnection } = require('../../firebase/secondarydb');
const { v4: uuidv4 } = require('uuid');

class CategoryService {
  constructor() {
    this.primaryCategoryRepo = new CategoryRepository(primaryDbConnection);
    this.secondaryCategoryRepo = new CategoryRepository(secondaryDbConnection);
  }

  async createCategory(data) {
    data.id = uuidv4();
    // Call both primary and secondary DBs
    const primaryResult = await this.primaryCategoryRepo.createCategory(data);
    const secondaryResult = await this.secondaryCategoryRepo.createCategory(data);
    
    return { primary: primaryResult, secondary: secondaryResult };
  }

  async getCategoryById(id) {
    const primaryResult = await this.primaryCategoryRepo.getCategoryById(id);
    return primaryResult;

  }

  //list
  async getAllCategories(query) {
    const primaryResult = await this.primaryCategoryRepo.getAllCategories(query);
    return primaryResult;

  }

  async updateCategory(id, data) {
    const primaryResult = await this.primaryCategoryRepo.updateCategory(id, data);
    const secondaryResult = await this.secondaryCategoryRepo.updateCategory(id, data);
    
    return { primary: primaryResult, secondary: secondaryResult };
  }

  //update is_category_active field in product
  async updateProductCategory(id, isActive) {
    console.log("object" , id, isActive)
    const primaryResult = await this.primaryCategoryRepo.updateProductCategory(id, isActive);
    const secondaryResult = await this.secondaryCategoryRepo.updateProductCategory(id, isActive);
    
    return { primary: primaryResult, secondary: secondaryResult };
  }

  async deleteCategory(id) {
    const primaryResult = await this.primaryCategoryRepo.deleteCategory(id);
    const secondaryResult = await this.secondaryCategoryRepo.deleteCategory(id);

    return { primary: primaryResult, secondary: secondaryResult };
  }
}

module.exports = new CategoryService();
