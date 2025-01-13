const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

// Database configurations for different companies
const dbConfigs = {
  'company1': {
    apiKey: "AIzaSyA5CF5YC7K8wnygKyg8H2BQUlJmY1Cqo0Y",
    authDomain: "website-sowrajm.firebaseapp.com",
    projectId: "website-sowrajm",
    storageBucket: "website-sowrajm.firebasestorage.app",
    messagingSenderId: "514442393360",
    appId: "1:514442393360:web:70416af1f1f59bf0c5d795",
    measurementId: "G-PD2ELW3RLK",
    razorpay: {
      key_id: "rzp_live_company1_key",
      key_secret: "company1_secret_key"
    },
    email: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-specific-password'
      }
    },
    whatsapp: {
      apiKey: '30c60cad789882970dced98498ec2332',
      fromNumber: '+918762724278',
      templateName: 'text_otp'
    }
  },
  // Add more company configurations as needed
  'default': {
    // Your default configuration (current configuration)
    apiKey: "AIzaSyA5CF5YC7K8wnygKyg8H2BQUlJmY1Cqo0Y",
    authDomain: "website-sowrajm.firebaseapp.com",
    projectId: "website-sowrajm",
    storageBucket: "website-sowrajm.firebasestorage.app",
    messagingSenderId: "514442393360",
    appId: "1:514442393360:web:70416af1f1f59bf0c5d795",
    measurementId: "G-PD2ELW3RLK",
    razorpay: {
      key_id: "rzp_live_7zuH154CVQA9YI",
      key_secret: "NEI0BRFsHp30NQXUkdnIAUFj"
    },
    email: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-specific-password'
      }
    },
    whatsapp: {
      apiKey: '30c60cad789882970dced98498ec2332',
      fromNumber: '+918762724278',
      templateName: 'text_otp'
    }
  }
};

const firebaseApps = {};

function getDbConnection(companyId) {
  if (!companyId) {
    companyId = 'default';
  }

  // If connection already exists, return it
  if (firebaseApps[companyId]) {
    return firebaseApps[companyId].firestore();
  }

  // Get config for company, fallback to default if not found
  const config = dbConfigs[companyId] || dbConfigs.default;
  
  // Initialize new Firebase app with unique name
  const appName = `app-${companyId}`;
  const app = firebase.initializeApp(config, appName);
  
  // Store the app instance
  firebaseApps[companyId] = app;
  
  // Return Firestore instance
  return app.firestore();
}

// Function to get Razorpay config
function getRazorpayConfig(companyId) {
  const config = dbConfigs[companyId] || dbConfigs.default;
  return config.razorpay;
}

// Add new function to get email config
function getEmailConfig(companyId) {
  const config = dbConfigs[companyId] || dbConfigs.default;
  return config.email;
}

// Add new function to get WhatsApp config
function getWhatsAppConfig(companyId) {
  const config = dbConfigs[companyId] || dbConfigs.default;
  return config.whatsapp;
}

module.exports = { 
  getDbConnection, 
  getRazorpayConfig, 
  getEmailConfig,
  getWhatsAppConfig 
}; 