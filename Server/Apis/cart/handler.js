const cartService = require('./service'); // Adjust path as needed

class CartHandler {
  async createCart(req, res) {
    try {
      const result = await cartService.createCart(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCartByUserId(req, res) {
    try {
      const result = await cartService.getCartByUserId(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async addItemToCart(req, res) {
    try {
      const result = await cartService.addItemToCart(req.params.userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateCart(req, res) {
    try {
      const result = await cartService.updateCart(req.params.userId, req.body.items);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteCart(req, res) {
    try {
      const result = await cartService.deleteCart(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new CartHandler();
