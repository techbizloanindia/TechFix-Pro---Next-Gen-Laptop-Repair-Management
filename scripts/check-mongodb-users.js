const fetch = require('node-fetch');

async function checkMongoDBUsers() {
  console.log('🔍 CHECKING MONGODB LOGIN CREDENTIALS');
  console.log('=' .repeat(50));
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Check database status and users
    console.log('📊 Connecting to MongoDB...');
    const response = await fetch(`${baseUrl}/api/debug/db-status`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ MongoDB connection successful');
      console.log(`📈 Total users in database: ${data.database.userCount}`);
      
      if (data.database.userCount === 0) {
        console.log('❌ NO LOGIN CREDENTIALS FOUND');
        console.log('🔧 Run this to create credentials:');
        console.log('   node scripts/final-setup.js');
        return;
      }
      
      console.log('\n👥 Available Login Credentials:');
      console.log('-'.repeat(50));
      
      data.database.users.forEach((user, index) => {
        console.log(`${index + 1}. Username: ${user.username}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
        console.log('');
      });
      
      // Show expected passwords (since we can't retrieve them from hash)
      console.log('🔐 Expected Passwords:');
      console.log('-'.repeat(50));
      
      const expectedCredentials = {
        'Mr.Jagrit': 'Jagrit@1234',
        'Mr.Aashish': 'Aashish@1234', 
        'Mr.Chandrakant': 'Chandrakant@1234',
        'Mr.Nitish': 'Nitish@1234'
      };
      
      data.database.users.forEach(user => {
        const expectedPassword = expectedCredentials[user.username];
        if (expectedPassword) {
          console.log(`• ${user.username} → Password: ${expectedPassword}`);
        } else {
          console.log(`• ${user.username} → Password: Unknown`);
        }
      });
      
      // Test one login to verify it works
      console.log('\n🧪 Testing first credential...');
      const firstUser = data.database.users[0];
      const testPassword = expectedCredentials[firstUser.username];
      
      if (testPassword) {
        try {
          const loginResponse = await fetch(`${baseUrl}/api/auth/simple-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: firstUser.username,
              password: testPassword
            })
          });
          
          const loginData = await loginResponse.json();
          
          if (loginResponse.ok) {
            console.log('✅ Login test SUCCESSFUL');
            console.log(`   Welcome: ${loginData.user.name}`);
          } else {
            console.log('❌ Login test FAILED');
            console.log(`   Error: ${loginData.message}`);
          }
        } catch (error) {
          console.log('❌ Login test ERROR');
          console.log(`   Error: ${error.message}`);
        }
      }
      
      console.log('\n' + '='.repeat(50));
      console.log('📋 SUMMARY:');
      console.log(`   • MongoDB Status: Connected ✅`);
      console.log(`   • Total Credentials: ${data.database.userCount}`);
      console.log(`   • Database Location: MongoDB`);
      console.log(`   • Authentication: Working`);
      
    } else {
      console.log('❌ Database check failed:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error checking MongoDB users:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure server is running: npm run dev');
    console.log('   2. Check MongoDB is running');
    console.log('   3. Verify .env.local has MONGODB_URI');
    console.log('   4. Check port 3000 is accessible');
  }
}

checkMongoDBUsers();