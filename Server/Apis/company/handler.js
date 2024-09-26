const companyService = require('./service'); // Adjust path as needed

class CompanyHandler {
  async createCompany(req, res) {
    try {
      const result = await companyService.createCompany(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCompanyById(req, res) {
    try {
      const result = await companyService.getCompanyById(req.params.id);
      if (!result) {
        return res.status(404).json({ message: 'Company not found' });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllCompanies(req, res) {
    try {
      const query = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
      };

      const result = await companyService.getAllCompanies(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCompany(req, res) {
    try {
      const result = await companyService.updateCompany(req.params.id, req.body);
      if (!result) {
        return res.status(404).json({ message: 'Company not found' });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCompany(req, res) {
    try {
      const result = await companyService.deleteCompany(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CompanyHandler();
