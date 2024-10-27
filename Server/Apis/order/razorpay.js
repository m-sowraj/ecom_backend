const Razorpay = require("razorpay");
const crypto = require("crypto");

class RazorpayService {
  constructor() {
    this.razorpayInstance = new Razorpay({
      key_id: "rzp_test_1fnXxH9tbCS1tE",  
      key_secret: "2NxPnFX6Rvq6Ryd9TXv9Xsqz"  
    });
  }

  async createPaymentOrder(amount, receiptId) {
    try {

      console.log("anmount", amount);
      console.log("receiptId", receiptId);
      const options = {
        amount: amount * 100, 
        currency: "INR",
        receipt: receiptId
      };
      const order = await this.razorpayInstance.orders.create(options);
      return order;
    } catch (error) {
      throw new Error("Error creating Razorpay order: " + error.message);
    }
  }

  verifyPaymentSignature({ order_id, payment_id, signature }) {
    const generatedSignature = crypto
      .createHmac("sha256", "2NxPnFX6Rvq6Ryd9TXv9Xsqz")
      .update(order_id + "|" + payment_id)
      .digest("hex");

    return generatedSignature === signature;
  }
}

module.exports = new RazorpayService();
