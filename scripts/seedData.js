require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const WasteReport = require('../src/models/wasteReport');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await WasteReport.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin Users
    const admins = await User.create([
      {
        fullName: 'Admin User',
        phone: '08012345678',
        email: 'admin@cleanlagos.com',
        password: '123456',
        role: 'lawma_admin',
        isPhoneVerified: true,
        isActive: true
      },
      {
        fullName: 'System Admin',
        phone: '08098765432',
        email: 'sysadmin@cleanlagos.com',
        password: '123456',
        role: 'system_admin',
        isPhoneVerified: true,
        isActive: true
      }
    ]);
    console.log('✅ Created', admins.length, 'admin users');

    // Create Citizens
    const citizens = await User.create([
      {
        fullName: 'Chidi Okafor',
        phone: '08011111111',
        email: 'chidi@example.com',
        password: '123456',
        role: 'citizen',
        address: '12 Ikeja Road, Lagos',
        location: { type: 'Point', coordinates: [3.3792, 6.5244] },
        points: 150,
        isPhoneVerified: true,
        isActive: true
      },
      {
        fullName: 'Amina Bello',
        phone: '08022222222',
        email: 'amina@example.com',
        password: '123456',
        role: 'citizen',
        address: '45 Victoria Island, Lagos',
        location: { type: 'Point', coordinates: [3.4219, 6.4281] },
        points: 200,
        isPhoneVerified: true,
        isActive: true
      },
      {
        fullName: 'Tunde Adeyemi',
        phone: '08033333333',
        email: 'tunde@example.com',
        password: '123456',
        role: 'citizen',
        address: '78 Lekki Phase 1, Lagos',
        location: { type: 'Point', coordinates: [3.4736, 6.4474] },
        points: 75,
        isPhoneVerified: true,
        isActive: true
      }
    ]);
    console.log('✅ Created', citizens.length, 'citizens');

    // Create PSP (Private Sector Participant)
    const psps = await User.create([
      {
        fullName: 'Lagos Waste Solutions',
        phone: '08044444444',
        email: 'psp1@example.com',
        password: '123456',
        role: 'psp',
        address: 'Waste Management Center, Ojota',
        location: { type: 'Point', coordinates: [3.3792, 6.5890] },
        isPhoneVerified: true,
        isActive: true
      },
      {
        fullName: 'Clean City Services',
        phone: '08055555555',
        email: 'psp2@example.com',
        password: '123456',
        role: 'psp',
        address: 'Recycling Hub, Yaba',
        location: { type: 'Point', coordinates: [3.3711, 6.5152] },
        isPhoneVerified: true,
        isActive: true
      }
    ]);
    console.log('✅ Created', psps.length, 'PSP users');

    // Create Waste Reports
    const reports = await WasteReport.create([
      {
        title: 'Overflowing bins at Ikeja Market',
        description: 'Multiple waste bins are overflowing near the main entrance',
        reporter: citizens[0]._id,
        location: { type: 'Point', coordinates: [3.3567, 6.5964] },
        address: 'Ikeja Market, Lagos',
        category: 'household',
        severity: 'high',
        status: 'pending',
        images: []
      },
      {
        title: 'Illegal dumping site on Lekki Road',
        description: 'Large pile of construction waste dumped illegally',
        reporter: citizens[1]._id,
        location: { type: 'Point', coordinates: [3.4736, 6.4474] },
        address: 'Lekki-Epe Expressway',
        category: 'construction',
        severity: 'critical',
        status: 'assigned',
        assignedTo: psps[0]._id,
        images: []
      },
      {
        title: 'Medical waste near hospital',
        description: 'Improperly disposed medical waste found near Lagos General Hospital',
        reporter: citizens[2]._id,
        location: { type: 'Point', coordinates: [3.3792, 6.4541] },
        address: 'Lagos Island',
        category: 'medical',
        severity: 'critical',
        status: 'in_progress',
        assignedTo: psps[1]._id,
        images: []
      },
      {
        title: 'Recyclable materials collection needed',
        description: 'Large amount of plastic bottles and cardboard ready for collection',
        reporter: citizens[0]._id,
        location: { type: 'Point', coordinates: [3.4219, 6.4281] },
        address: 'Victoria Island Shopping Complex',
        category: 'recyclable',
        severity: 'low',
        status: 'completed',
        assignedTo: psps[0]._id,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        images: []
      },
      {
        title: 'Blocked drainage with waste',
        description: 'Drainage system blocked by accumulated waste causing flooding',
        reporter: citizens[1]._id,
        location: { type: 'Point', coordinates: [3.3711, 6.5152] },
        address: 'Yaba, Lagos',
        category: 'household',
        severity: 'high',
        status: 'pending',
        images: []
      },
      {
        title: 'Industrial waste spill',
        description: 'Chemical waste spilled near industrial area',
        reporter: citizens[2]._id,
        location: { type: 'Point', coordinates: [3.3567, 6.5244] },
        address: 'Apapa Industrial Estate',
        category: 'industrial',
        severity: 'critical',
        status: 'assigned',
        assignedTo: psps[1]._id,
        images: []
      },
      {
        title: 'Street littering problem',
        description: 'Excessive littering on major street needs attention',
        reporter: citizens[0]._id,
        location: { type: 'Point', coordinates: [3.3792, 6.5890] },
        address: 'Allen Avenue, Ikeja',
        category: 'household',
        severity: 'medium',
        status: 'completed',
        assignedTo: psps[0]._id,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        images: []
      },
      {
        title: 'Abandoned vehicle with waste',
        description: 'Abandoned vehicle being used as illegal dump site',
        reporter: citizens[1]._id,
        location: { type: 'Point', coordinates: [3.4736, 6.4474] },
        address: 'Ajah, Lagos',
        category: 'other',
        severity: 'medium',
        status: 'in_progress',
        assignedTo: psps[1]._id,
        images: []
      }
    ]);
    console.log('✅ Created', reports.length, 'waste reports');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📊 Summary:');
    console.log('  - Admins:', admins.length);
    console.log('  - Citizens:', citizens.length);
    console.log('  - PSPs:', psps.length);
    console.log('  - Waste Reports:', reports.length);
    console.log('\n🔐 Login Credentials:');
    console.log('  Admin: 08012345678 / 123456');
    console.log('  System Admin: 08098765432 / 123456');
    console.log('  Citizen: 08011111111 / 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedData();
