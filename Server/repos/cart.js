class CartRepository {
    constructor(db) {
      this.db = db;
      this.collection = this.db.collection('carts');
    }
    
    static getCurrentISODate() {
      return new Date().toISOString();
    }


    async createCart(data) {
      data.created_at = CartRepository.getCurrentISODate();
      data.updated_at = CartRepository.getCurrentISODate();
      const { id } = data;
  
      const batch = this.db.batch();
      const companyRef = this.collection.doc(id);
      batch.set(companyRef, data);
      await batch.commit();
      return { id, ...data };
    }
  
    async getCartByUserId(userId) {
      const snapshot = await this.collection.where('userId', '==', userId).get();
      if (snapshot.empty) {
        throw new Error('Cart not found for this user');
      }
  
      const cart = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
      return cart;
    }
  
    async addItemToCart(userId, item) {
      updated_at = new Date();
      const cart = await this.getCartByUserId(userId);
      cart.cart_items.push(item);
      await this.collection.doc(cart.id).update({ items: cart.items , updated_at: updated_at});
      return cart;
    }

    async removeItemFromCart(userId, itemId) {
      updated_at = new Date();
      const cart = await this.getCartByUserId(userId);
      const updatedItems = cart.items.filter(item => item.id !== itemId);
      await this.collection.doc(cart.id).update({ items: updatedItems , updated_at: updated_at});
      return { ...cart, items: updatedItems };
    }
  
    async updateCart(userId, updatedItems) {
      updated_at = new Date();
      const cart = await this.getCartByUserId(userId);
      await this.collection.doc(cart.id).update({ items: updatedItems , updated_at: updated_at});
      return { ...cart, items: updatedItems };
    }
  
    async deleteCart(userId) {
      const cart = await this.getCartByUserId(userId);
      await this.collection.doc(cart.id).delete();
      return { id: cart.id, message: 'Cart deleted successfully' };
    }
  }
  
  module.exports = CartRepository;
  