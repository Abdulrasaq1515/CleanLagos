const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

dotenv.config();

const testUsers = [
  {
    phone: '08012345678',
    password: 'password123',
    fullName: 'Test Citizen',
    email: 'citizen@test.com',
    role: 'citizen',
    isPhoneVerified: true,
    isActive: true,
    points: 100
  },
  {
    phone: '08012345679',
    password: 'password123',
    fullName: 'Test PSP Worker',
    email: 'psp@test.com',
    role: 'psp', // Changed from psp_worker to match User model enum
    isPhoneVerified: true,
    isActive: true
  },
  {
    phone: '08012345680',
    password: 'password123',
    fullName: 'Test Admin',
    email: 'admin@test.com',
    role: 'lawma_admin',
    isPhoneVerified: true,
    isActive: true
  },
  {
    phone: '08012345681',
    password: 'password123',
    fullName: 'Test Recycler',
    email: 'recycler@test.com',
    role: 'recycler',
    isPhoneVerified: true,
    isActive: true,
    points: 50
  }
];

async function seedTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing test users
    await User.deleteMany({ phone: { $in: testUsers.map(u => u.phone) } });
    console.log('🗑️  Cleared existing test users');

    // Create test users
    for (const userData of testUsers) {
      const user = await User.create(userData);
      console.log(`✅ Created ${user.role}: ${user.fullName} (${user.phone})`);
    }

    console.log('\n🎉 Test users seeded successfully!');
    console.log('\n📱 You can now login with:');
    console.log('   Phone: 08012345678, Password: password123 (Citizen)');
    console.log('   Phone: 08012345679, Password: password123 (PSP Worker)');
    console.log('   Phone: 08012345680, Password: password123 (Admin)');
    console.log('   Phone: 08012345681, Password: password123 (Recycler)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test users:', error);
    process.exit(1);
  }
}

seedTestUsers();
