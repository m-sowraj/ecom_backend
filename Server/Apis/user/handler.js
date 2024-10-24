const userService = require('./service'); // Adjust path as needed
const { createToken, createRefreshToken } = require('../../helpers/jwt');
const bcrypt = require('bcrypt');



class UserHandler {

  async createUser(req, res) {
    try {
      // Extract the password from the request body
      const { password, ...userData } = req.body;
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  
      // Create a new user with the hashed password
      const result = await userService.createUser({ ...userData, hashed_password: hashedPassword  });
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  async login(req, res) {
    try {
      const { phone , otp} = req.body;
      
      // Fetch user from the database
      const user = await userService.getUserByPhone(phone);
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // // Verify the password
      // const isMatch = await bcrypt.compare(password, user.hashed_password); // Check hashed password
  
      // if (!isMatch) {
      //   return res.status(401).json({ message: 'Invalid email or password' });
      // }
  
      // Generate access and refresh tokens
      const accessToken = createToken(user.company_id, user.id, user.role);
      const refreshToken = createRefreshToken(user.id);
  
      // Set tokens in cookies
      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 604800000 // 1 hour
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 604800000 // 7 days
      });
      res.cookie('user', user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 604800000 // 1 hour
      });
  
      // Respond with user info (excluding sensitive data)
      res.status(200).json({ message: 'Login successful', user: { id: user.id, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  


  async getUserById(req, res) {
    try {

      //company id fileter baed on token
      if(req.user.user_role == 'super_admin'){
        //no fileter
      }
      else if(req.user.user_role == 'admin'){
        req.params.company_id = req.user.company_id;
      } else {
        req.params.company_id = req.user.company_id;
      }

      const result = await userService.getUserById(req.params.id);

  
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getUser(req, res) {
    try {

      console.log("hi")
      console.log(req.user)

      const { user_id } = req.user;
      // console.log("-----------",req.user.user_id)
      const result = await userService.getUserById(user_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }


  async getAllUsers(req, res) {
    try {
      const query = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
      };

      //company id fileter baed on token
      if(req.user.user_role == 'admin'){
        query.company_id = req.user.company_id;
      }


      const result = await userService.getAllUsers(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const result = await userService.updateUser(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateUserbydata(req, res) {
    try {
      const { user_id } = req.user;
      const result = await userService.updateUser(user_id,req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new UserHandler();
