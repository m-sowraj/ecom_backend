const UserRepository = require('../../repos/user'); // Adjust path as needed
const { primaryDbConnection } = require('../../firebase/primarydb');
const { secondaryDbConnection } = require('../../firebase/secondarydb');
const { v4: uuidv4 } = require('uuid');

class UserService {
  constructor() {
    this.primaryUserRepo = new UserRepository(primaryDbConnection);
    this.secondaryUserRepo = new UserRepository(secondaryDbConnection);
  }

  async createUser(data) {

    data.id = uuidv4();
    const primaryResult = await this.primaryUserRepo.createUser(data);
    
    return primaryResult
  }

  async getUserById(id) {
    const primaryResult = await this.primaryUserRepo.getUserById(id);

    return primaryResult;
  }

  //get user by email
  async getUserByEmail(email) {
    const primaryResult = await this.primaryUserRepo.getUserByEmail(email);

    return primaryResult;
  }

  async getUserByPhone(phone) {
    const primaryResult = await this.primaryUserRepo.getUserByPhone(phone);

    return primaryResult;
  }
  

  async getAllUsers(query) {
    const primaryResult = await this.primaryUserRepo.getAllUsers(query);

    return primaryResult;
  }

  async updateUser(id, data) {
    const primaryResult = await this.primaryUserRepo.updateUser(id, data);
    
    return primaryResult;
  }


  async deleteUser(id) {
    const primaryResult = await this.primaryUserRepo.deleteUser(id);

    return primaryResult;
  }
}

module.exports = new UserService();
