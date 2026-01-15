require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const WasteReport = require('../src/models/wasteReport');

const minimalSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear ALL existing data
    await User.deleteMany({});
    await WasteReport.deleteMany({});
    console.log('🗑️  Cleared all existing data');

    // Create just ONE citizen for the demo report
    const citizen = await User.create({
      fullName: 'Demo Citizen',
      phone: '08099999999',
      email: 'demo@example.com',
      password: '123456',
      role: 'citizen',
      address: '123 Demo Street, Lagos',
      location: { type: 'Point', coordinates: [3.3792, 6.5244] },
      points: 50,
      isPhoneVerified: true,
      isActive: true
    });
    console.log('✅ Created 1 demo citizen');

    // Create just ONE demo waste report
    const report = await WasteReport.create({
      title: 'Demo Waste Report - Overflowing Bin',
      description: 'This is a demo waste report to show how the system works',
      reporter: citizen._id,
      location: { type: 'Point', coordinates: [3.3792, 6.5244] },
      address: 'Demo Location, Lagos',
      category: 'household',
      severity: 'medium',
      status: 'pending',
      images: []
    });
    console.log('✅ Created 1 demo waste report');

    console.log('\n🎉 Minimal seed completed!\n');
    console.log('📊 Database now has:');
    console.log('  - 1 Demo Citizen');
    console.log('  - 1 Demo Waste Report');
    console.log('\n✨ You can now register your admin through the browser at:');
    console.log('   http://localhost:3000/register\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

minimalSeed();
