require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Delete existing user with this phone if exists
    await User.deleteOne({ phone: '08012345678' });
    console.log('🗑️  Deleted existing user');

    // Create new admin user
    const admin = await User.create({
      fullName: 'Test Admin',
      phone: '08012345678',
      email: 'admin@cleanlagos.com',
      password: '123456',
      role: 'lawma_admin',
      isPhoneVerified: true,
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('📱 Phone:', admin.phone);
    console.log('🔑 Password: 123456');
    console.log('👤 Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
