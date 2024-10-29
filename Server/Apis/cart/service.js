const CartRepository = require('../../repos/cart'); // Adjust path as needed
const { primaryDbConnection } = require('../../firebase/primarydb');
const { secondaryDbConnection } = require('../../firebase/secondarydb');
const { v4: uuidv4 } = require('uuid');


class CartService {
  constructor() {
    this.primaryCartRepo = new CartRepository(primaryDbConnection);
    this.secondaryCartRepo = new CartRepository(secondaryDbConnection);
  }

  async createCart(data) {
    data.id = uuidv4();
    const primaryResult = await this.primaryCartRepo.createCart(data);
    return primaryResult;
  }

  async getCartByUserId(userId) {
    const primaryResult = await this.primaryCartRepo.getCartByUserId(userId);
    return primaryResult;
  }

  async addItemToCart(userId, item) {
    item.id = uuidv4();
    const primaryResult = await this.primaryCartRepo.addItemToCart(userId, item);
    return primaryResult;
    // return { primary: primaryResult, secondary: secondaryResult };
  }

  async removeItemFromCart(userId, itemId) {
    const primaryResult = await this.primaryCartRepo.removeItemFromCart(userId, itemId);
    return primaryResult;
    // return { primary: primaryResult, secondary: secondaryResult };
  }

  async updateCart(userId, updatedItems) {
    const primaryResult = await this.primaryCartRepo.updateCart(userId, updatedItems);
    return primaryResult;
    // return { primary: primaryResult, secondary: secondaryResult };
  }

  async deleteCart(userId) {
    const primaryResult = await this.primaryCartRepo.deleteCart(userId);
    return primaryResult;
    // return { primary: primaryResult, secondary: secondaryResult };
  }

  async getItemCount(userId) {
    const primaryResult = await this.primaryCartRepo.getItemCount(userId);
    return primaryResult;
  }
}

module.exports = new CartService();
