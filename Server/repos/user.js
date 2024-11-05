class UserRepository {
    constructor(db) {
      this.db = db;
      this.collection = this.db.collection('users');
    }

    static getCurrentISODate() {
      return new Date().toISOString();
    }
  
  
    async createUser(data) {
      data.createdAt = UserRepository.getCurrentISODate();
      data.updatedAt = UserRepository.getCurrentISODate();
      const { id } = data;

      // Use a batch write to improve performance
      const batch = this.db.batch();
      const companyRef = this.collection.doc(id);
      batch.set(companyRef, data);
      await batch.commit();
      return { id, ...data };
    }


    async getUserByEmail(email) {
      const snapshot = await this.collection.where('email', '==', email).get();
      if (snapshot.empty) {
        return null;
      }
      let user = null;
      snapshot.forEach(doc => {
        user = { id: doc.id, ...doc.data() };
      });
      return user;
    }

    //get user by phone
    async getUserByPhone(phone) {
      const snapshot = await this.collection.where('mobileNumber', '==', phone).get();
      if (snapshot.empty) {
        return null;
      } 
      let user = null;
      snapshot.forEach(doc => {
        user = { id: doc.id, ...doc.data() };
      });
      return user;
    }
  
    async getUserById(id) {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error('User not found');
      }
    }
  
    async getAllUsers(query) {
  
      let ref = this.collection

      // Apply filters based on query parameters
      if (query.role) {
        ref = ref.where('role', '==', query.role);
      }

      //companu id
      if (query.company_id) {
        ref = ref.where('company_id', '==', query.company_id);
      }
      
      const snapshot = await ref.get();
      const users = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
  
      return users;
    }
  
    async updateUser(id, data) {
      data.updated_at = new Date();
      const docRef = this.collection.doc(id);
      await docRef.update(data);
      const updatedUser = await docRef.get();
      return { id: updatedUser.id, ...updatedUser.data() };
    }
  
    async deleteUser(id) {
      const docRef = this.collection.doc(id);
      await docRef.delete();
      return { id, message: 'User deleted successfully' };
    }
  }
  
  module.exports = UserRepository;
  