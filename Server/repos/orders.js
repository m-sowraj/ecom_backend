class OrderRepository {
    constructor(db) {
      this.db = db;
      this.collection = this.db.collection('orders');
    }

    static getCurrentISODate() {
      return new Date().toISOString();
    }
  
    async createOrder(data) {
      data.createdAt = OrderRepository.getCurrentISODate();
      data.updatedAt = OrderRepository.getCurrentISODate();
      const { id } = data;
  
      // Use a batch write to improve performance
      const batch = this.db.batch();
      const companyRef = this.collection.doc(id);
      batch.set(companyRef, data);
      await batch.commit();
      return { id, ...data };
    }
  
    async getOrderById(id) {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error('Order not found');
      }
    }
  
    async getAllOrders(query) {
      const limit = query.limit ? parseInt(query.limit) : 10;
      const page = query.page ? parseInt(query.page) : 1;
  
      let ref = this.collection;
  
      // Apply filters based on query parameters
      if (query.userId) {
        ref = ref.where('userId', '==', query.userId);
      }
      if (query.status) {
        ref = ref.where('status', '==', query.status);
      }
      if (query.startDate && query.endDate) {
        ref = ref.where('createdAt', '>=', new Date(query.startDate))
                 .where('createdAt', '<=', new Date(query.endDate));
      }
  
      ref = ref.limit(limit).offset((page - 1) * limit);
      
      const snapshot = await ref.get();
      const orders = [];
      snapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
      });
  
      return orders;
    }
  
    async updateOrder(id, data) {
      data.updatedAt = new Date();
      const docRef = this.collection.doc(id);
      await docRef.update(data);
      const updatedOrder = await docRef.get();
      return { id: updatedOrder.id, ...updatedOrder.data() };
    }
  
    async deleteOrder(id) {
      const docRef = this.collection.doc(id);
      await docRef.delete();
      return { id, message: 'Order deleted successfully' };
    }
  }
  
  module.exports = OrderRepository;
  