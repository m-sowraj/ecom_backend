const OrderRepository = require('../../repos/orders');
const { primaryDbConnection } = require('../../firebase/primarydb');
const { secondaryDbConnection } = require('../../firebase/secondarydb');
const { v4: uuidv4 } = require('uuid');

class OrderService {
  constructor() {
    this.primaryOrderRepo = new OrderRepository(primaryDbConnection);
    this.secondaryOrderRepo = new OrderRepository(secondaryDbConnection);
  }

  async createOrder(data) {
    data.id = uuidv4();
    const primaryResult = await this.primaryOrderRepo.createOrder(data);

    return primaryResult;

  }

  async getOrderById(id) {
    const primaryResult = await this.primaryOrderRepo.getOrderById(id);
 
    return primaryResult;

  }

  async getAllOrders(query) {
    const primaryResult = await this.primaryOrderRepo.getAllOrders(query);
  
    return primaryResult;

  }

  async updateOrder(id, data) {
    const primaryResult = await this.primaryOrderRepo.updateOrder(id, data);

    return primaryResult;

  }

  async deleteOrder(id) {
    const primaryResult = await this.primaryOrderRepo.deleteOrder(id);

    return primaryResult;

  }
}

module.exports = new OrderService();
