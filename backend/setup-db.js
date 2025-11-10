const { sequelize } = require('./src/models');

async function setupDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    console.log('Dropping existing tables...');
    await sequelize.drop({ cascade: true });
    console.log('✅ Tables dropped');

    console.log('Syncing models...');
    await sequelize.sync({ force: true });
    console.log('✅ Database synced successfully');

    // Get all tables
    const result = await sequelize.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `);
    
    console.log('\n📋 Created tables:');
    result[0].forEach(t => {
      console.log('  - ' + t.tablename);
    });

    console.log('\n✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
