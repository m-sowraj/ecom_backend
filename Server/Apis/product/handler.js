const productService = require('./service'); // Import your product service

class ProductHandler {
  async createProduct(req, res) {
    try {
     let data = req.body;
      //get cotegory active status
      const category = await productService.getCategoryById(req.body.category_id); 
      if(!category.is_active){
        data.is_category_active = false;
      }else{
        data.is_category_active = true;
      }

      data.company_id = req.user.company_id;
    
      const result = await productService.createProduct(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const result = await productService.getProductById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message }); // 404 for not found
    }
  }

  async getAllProducts(req, res) {
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

      const result = await productService.getAllProducts(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const result = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message }); // 404 for not found
    }
  }

  async deleteProduct(req, res) {
    try {
      const result = await productService.deleteProduct(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message }); // 404 for not found
    }
  }
}

module.exports = new ProductHandler();
