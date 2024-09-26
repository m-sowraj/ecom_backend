const CompanyRepository = require('../../repos/company'); // Adjust path as needed
const { primaryDbConnection } = require('../../firebase/primarydb');
const { secondaryDbConnection } = require('../../firebase/secondarydb');
const { v4: uuidv4 } = require('uuid');

class CompanyService {
  constructor() {
    this.primaryCompanyRepo = new CompanyRepository(primaryDbConnection);
    this.secondaryCompanyRepo = new CompanyRepository(secondaryDbConnection);
  }

  async createCompany(data) {
    data.id = uuidv4(); // Generate a unique ID for the company
    console.log(data)
    const primaryResult = await this.primaryCompanyRepo.createCompany(data);
    return primaryResult;
  }

  async getCompanyById(companyId) {
    const primaryResult = await this.primaryCompanyRepo.getCompanyById(companyId);
    return primaryResult;
  }

  async getAllCompanies(query) {
    const primaryResult = await this.primaryCompanyRepo.getAllCompanies(query);
    return primaryResult;
  }

  async updateCompany(companyId, updatedData) {
    const primaryResult = await this.primaryCompanyRepo.updateCompany(companyId, updatedData);
    return primaryResult;
  }

  async deleteCompany(companyId) {
    const primaryResult = await this.primaryCompanyRepo.deleteCompany(companyId);
    return primaryResult;
  }
}

module.exports = new CompanyService();
