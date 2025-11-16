// Quick MongoDB Connection Test

const mongoose = require('mongoose');
require('dotenv').config();

console.log('\n🔍 Testing MongoDB Connection...\n');
console.log('URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connection Successful!');
    console.log('   Database:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    console.log('   Port:', mongoose.connection.port);
    
    console.log('\n📊 Testing Collections...');
    return mongoose.connection.db.listCollections().toArray();
  })
  .then((collections) => {
    console.log(`   Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    if (collections.length === 0) {
      console.log('   (No collections yet - will be created when you add data)');
    }
    
    console.log('\n🎉 All tests passed!\n');
    process.exit(0);
  })
  .catch((err) => {
    console.log('\n❌ MongoDB Connection Failed!');
    console.log('   Error:', err.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check if MongoDB is running: mongosh');
    console.log('   2. Verify MONGODB_URI in .env file');
    console.log('   3. Default URI: mongodb://localhost:27017/auctra_db\n');
    process.exit(1);
  });
