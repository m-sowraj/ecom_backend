const orderService = require('./service'); // Adjust path as needed
const RazorpayService = require("./razorpay");
class OrderHandler {
  async createOrder(req, res) {
    try {
      const result = await orderService.createOrder(req.body);
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const result = await orderService.getOrderById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const query = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
        userId: req.query.userId,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };

      const result = await orderService.getAllOrders(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const result = await orderService.updateOrder(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const result = await orderService.deleteOrder(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async createOrderItem(req, res) {
    try {
      const result = await orderService.createOrderItem(req.body);
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async verifyPayment(req, res) {
      const { order_id, payment_id, razorpay_signature , DB_order_id } = req.body;
      
      const isValid = RazorpayService.verifyPaymentSignature({ order_id, payment_id, signature: razorpay_signature });
      if (isValid) {
        //update order
        await orderService.updateOrder(DB_order_id, { status: "paid" });
        res.json({ status: "success", message: "Payment verified successfully" });
      } else {
        await orderService.updateOrder(order_id, { status: "failed" });
        res.status(400).json({ status: "failure", message: "Payment verification failed" });
      }
    }

  
}


module.exports = new OrderHandler();
