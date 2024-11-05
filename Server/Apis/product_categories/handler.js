const categoryService = require('./service');

class CategoryHandler {
  async createCategory(req, res) {
    try {
      //check access from token
     if(req.user.user_role == 'admin'){
        req.body.company_id = req.user.company_id;
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }

      console.log(req.body)
      console.log(req.user.company_id)
      const result = await categoryService.createCategory({...req.body , user_id: req.user.id , company_id: req.user.company_id});
      res.status(201).json(result);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  }

  async getCategoryById(req, res) {
    try {

      const result = await categoryService.getCategoryById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //list
  async getAllCategories(req, res) {
    try {
      //filter based on query
      const query = {}
      if (req.query.name) {
        query.name = req.query.name;
      }

      //filter based on token
      if(req.user.user_role == 'admin'){
        query.company_id = req.user.company_id;
        
      }
      else{
        query.company_id = req.user.company_id;
        query.is_active = true;
      }

      const result = await categoryService.getAllCategories(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      //if it has access
      if(req.user.user_role == 'admin'){
      }
      else{
        res.status(401).json({ message: 'Unauthorized' });
      }

      //if req has is_active field then update is_category_active field in product
      if(req.body.is_active == false || req.body.is_active == true){
        await categoryService.updateProductCategory(req.params.id, req.body.is_active);
      }


      const result = await categoryService.updateCategory(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const result = await categoryService.deleteCategory(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CategoryHandler();
