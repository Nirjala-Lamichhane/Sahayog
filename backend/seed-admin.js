const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./src/models');

async function seedAdmin() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@sahayog.com' } });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user found, updating password...');
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await existingAdmin.update({ password: hashedPassword });
      console.log('✅ Admin password reset successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email: admin@sahayog.com');
      console.log('🔐 Password: Admin@123');
      console.log('👤 Role: admin');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@sahayog.com',
      password: hashedPassword,
      role: 'admin',
      phone: '9999999999'
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@sahayog.com');
    console.log('🔐 Password: Admin@123');
    console.log('👤 Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
