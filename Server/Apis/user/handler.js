const userService = require('./service');
const { createToken, createRefreshToken } = require('../../helpers/jwt');
const bcrypt = require('bcrypt');
const OTPService = require('../../helpers/otp');

class UserHandler {
  async createUser(req, res) {
    try {
      const { password, ...userData } = req.body;
      const companyId = req.user?.company_id || userData.company_id;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      //check if email already exists
      const existingEmail = await userService.getUserByEmail(userData.email, companyId);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Create a new user with the hashed password
      const result = await userService.createUser({ 
        ...userData, 
        hashed_password: hashedPassword,
        company_id: companyId 
      });
      
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  async login(req, res) {
    try {
      const { email, password, phone, otp, company_id } = req.body;
      let user;

      // Check if this is an OTP verification attempt
      if (otp) {
        if (email) {
          // Verify email OTP
          const isValidOTP = await userService.verifyEmailOTP(email, otp, company_id);
          if (!isValidOTP) {
            return res.status(401).json({ message: 'Invalid OTP' });
          }
          user = await userService.getUserByEmail(email, company_id);
        } else if (phone) {
          // Verify phone OTP
          const isValidOTP = await userService.verifyOTP(phone, otp, company_id);
          if (!isValidOTP) {
            return res.status(401).json({ message: 'Invalid OTP' });
          }
          user = await userService.getUserByPhone(phone, company_id);
        }
      } else if (password) {
        // Traditional password login
        if (email) {
          user = await userService.getUserByEmail(email, company_id);
        } else if (phone) {
          user = await userService.getUserByPhone(phone, company_id);
        } else {
          return res.status(400).json({ message: 'Email or phone number is required for password login' });
        }

        if (!user) {
          return res.status(401).json({ 
            message: 'Would you like to receive an OTP?',
            requireOTP: true 
          });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) {
          return res.status(401).json({ 
            message: 'Would you like to receive an OTP?',
            requireOTP: true 
          });
        }
      } else {
        // Neither password nor OTP provided - send OTP
        if (email) {
          const otp = OTPService.generateOTP();
          await userService.saveEmailOTP(email, otp, company_id);
          await OTPService.sendEmailOTP(email, otp, company_id);
          return res.status(200).json({ 
            message: 'OTP sent to email',
            requireOTP: true,
            otpSent: true
          });
        } else if (phone) {
          const otp = OTPService.generateOTP();
          await userService.saveOTP(phone, otp, company_id);
          await OTPService.sendWhatsAppOTP(phone, otp, company_id);
          return res.status(200).json({ 
            message: 'OTP sent to phone',
            requireOTP: true,
            otpSent: true
          });
        } else {
          return res.status(400).json({ message: 'Email or phone number is required' });
        }
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Generate tokens
      const accessToken = createToken(user.company_id, user.id, user.role);
      const refreshToken = createRefreshToken(user.id);

      // Set cookies
      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 604800000,
        sameSite: 'None'
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 604800000,
        sameSite: 'None'
      });
      res.cookie('user', user.role, {
        httpOnly: true,
        secure: true,
        maxAge: 604800000,
        sameSite: 'None'
      });

      res.status(200).json({
        message: 'Login successful',
        user: { 
          id: user.id, 
          role: user.role, 
          company_id: user.company_id 
        },
        name: user.name
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUser(req, res) {
    try {
      const { user_id, company_id } = req.user;
      const result = await userService.getUserById(user_id, company_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await userService.getUserById(req.params.id, companyId);
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
        company_id: req.user.company_id,
      };

      const result = await userService.getAllUsers(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await userService.updateUser(req.params.id, req.body, companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateUserbydata(req, res) {
    try {
      const { user_id, company_id } = req.user;
      const result = await userService.updateUser(user_id, req.body, company_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const companyId = req.user.company_id;
      const result = await userService.deleteUser(req.params.id, companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async sendPhoneOTP(req, res) {
    try {
      const { phone, company_id } = req.body;
      
      // Generate OTP
      const otp = OTPService.generateOTP();
      
      // Save OTP in database with expiration
      await userService.saveOTP(phone, otp, company_id);
      
      // Send OTP via WhatsApp
      await OTPService.sendWhatsAppOTP(phone, otp, company_id);
      
      res.status(200).json({ 
        message: 'OTP sent successfully',
        phone: phone
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async verifyPhoneOTP(req, res) {
    try {
      const { phone, otp, company_id } = req.body;
      
      // Verify OTP
      const isValid = await userService.verifyOTP(phone, otp, company_id);
      
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
      
      // Mark phone as verified in user record
      await userService.markPhoneAsVerified(phone, company_id);
      
      res.status(200).json({ message: 'Phone verified successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async sendEmailOTP(req, res) {
    try {
      const { email, company_id } = req.body;
      
      // Generate OTP
      const otp = OTPService.generateOTP();
      
      // Save OTP in database with expiration
      await userService.saveEmailOTP(email, otp, company_id);
      
      // Send OTP via email
      await OTPService.sendEmailOTP(email, otp, company_id);
      
      res.status(200).json({ 
        message: 'OTP sent successfully',
        email: email
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async verifyEmailOTP(req, res) {
    try {
      const { email, otp, company_id } = req.body;
      
      // Verify OTP
      const isValid = await userService.verifyEmailOTP(email, otp, company_id);
      
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
      
      // Mark email as verified in user record
      await userService.markEmailAsVerified(email, company_id);
      
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserHandler();
