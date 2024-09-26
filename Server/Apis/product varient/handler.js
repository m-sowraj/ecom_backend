const ProductVarientService = require('./service'); // Import your ProductVarient service

class ProductVarientHandler {
  async createProductVarient(req, res) {
    try {
     let data = req.body;
         
      const result = await ProductVarientService.createProductVarient(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductVarientById(req, res) {
    try {
      const result = await ProductVarientService.getProductVarientById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message }); // 404 for not found
    }
  }

  async getAllProductVarients(req, res) {
    try {
      // Prepare query parameters
      const query = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
      };

      //category filter
      if (req.query.categoryId) {
        query.categoryId = req.query.categoryId;
      }

      if(req.query.product_id){
        query.product_id = req.query.product_id;
      }

      const result = await ProductVarientService.getAllProductVarients(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProductVarient(req, res) {
    try {
      const result = await ProductVarientService.updateProductVarient(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message }); // 404 for not found
    }
  }

  async deleteProductVarient(req, res) {
    try {
      const result = await ProductVarientService.deleteProductVarient(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message }); // 404 for not found
    }
  }
}

module.exports = new ProductVarientHandler();
