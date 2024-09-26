const OrderRepository = require('../../repos/orders');
const { primaryDbConnection } = require('../../firebase/primarydb');
const { secondaryDbConnection } = require('../../firebase/secondarydb');

const { v4: uuidv4 } = require('uuid');
const OrderItemsRepository = require('../../repos/ordersItems');
const ProductVarientRepository = require('../../repos/ProductVarients');

class OrderService {
  constructor() {
    this.primaryOrderRepo = new OrderRepository(primaryDbConnection);
    this.primaryOrderItemsRepo = new OrderItemsRepository(primaryDbConnection);
    this.primaryProductRepo = new ProductVarientRepository(primaryDbConnection);
    this.secondaryProductRepo = new ProductVarientRepository(secondaryDbConnection);
  }

  async createOrder(data) {
    data.id = uuidv4();
    const { order_items , ...orderData } = data;
    const primaryResult = await this.primaryOrderRepo.createOrder(orderData);
    if(order_items){
      order_items.forEach(async item => {
        item.order_id = data.id;
        await this.primaryOrderItemsRepo.createOrder(item);
        const product = await this.primaryProductRepo.getProductVarientById(item.product_id);
        await this.primaryProductRepo.updateProductVarient(item.product_varient_id, {stock: product.stock - item.quantity});
        await this.secondaryProductRepo.updateProductVarient(item.product_varient_id, {stock: product.stock - item.quantity});
      });
    }
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
