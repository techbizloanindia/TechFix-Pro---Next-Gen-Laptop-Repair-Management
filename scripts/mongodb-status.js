const fetch = require('node-fetch');

async function checkMongoDBStatus() {
  console.log('🔍 COMPLETE MONGODB STATUS CHECK');
  console.log('=' .repeat(60));
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Get detailed user information
    console.log('📊 Fetching detailed user information...');
    const response = await fetch(`${baseUrl}/api/debug/detailed-users`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`Database Error: ${data.message}`);
    }
    
    // Display database information
    console.log('✅ MongoDB Connection Successful');
    console.log('');
    console.log('📁 DATABASE INFORMATION:');
    console.log(`   • Database Name: ${data.database.name}`);
    console.log(`   • Collection: ${data.database.collection}`);
    console.log(`   • Documents: ${data.database.stats.documentCount}`);
    console.log(`   • Data Size: ${data.database.stats.dataSize} bytes`);
    console.log(`   • Storage Size: ${data.database.stats.storageSize} bytes`);
    
    // Display user summary
    console.log('');
    console.log('👥 USER SUMMARY:');
    console.log(`   • Total Users: ${data.summary.totalUsers}`);
    console.log(`   • Users with Passwords: ${data.summary.usersWithPassword}`);
    console.log(`   • Valid Bcrypt Hashes: ${data.summary.validBcryptHashes}`);
    
    // Display each user in detail
    if (data.users.length > 0) {
      console.log('');
      console.log('🔐 AVAILABLE LOGIN CREDENTIALS:');
      console.log('=' .repeat(60));
      
      data.users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username}`);
        console.log(`   • Name: ${user.name}`);
        console.log(`   • ID: ${user.id}`);
        console.log(`   • Password: ${user.hasPassword ? '✅ Set' : '❌ Missing'}`);
        console.log(`   • Hash Length: ${user.passwordHashLength} chars`);
        console.log(`   • Valid Hash: ${user.isValidBcryptHash ? '✅ Yes' : '❌ No'}`);
        console.log(`   • Created: ${new Date(user.createdAt).toLocaleString()}`);
        
        // Show expected password
        const expectedCred = data.expectedCredentials.find(c => c.username === user.username);
        if (expectedCred) {
          console.log(`   • Expected Password: ${expectedCred.expectedPassword}`);
          console.log(`   • Expected Name: ${expectedCred.expectedName}`);
          console.log(`   • Name Match: ${user.name === expectedCred.expectedName ? '✅ Yes' : '❌ No'}`);
        }
        console.log('');
      });
      
      // Test login functionality
      console.log('🧪 TESTING LOGIN FUNCTIONALITY:');
      console.log('-'.repeat(40));
      
      let workingCredentials = 0;
      
      for (const user of data.users) {
        const expectedCred = data.expectedCredentials.find(c => c.username === user.username);
        
        if (expectedCred && user.hasPassword) {
          console.log(`Testing: ${user.username}`);
          
          try {
            const loginResponse = await fetch(`${baseUrl}/api/auth/simple-login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: user.username,
                password: expectedCred.expectedPassword
              })
            });
            
            const loginData = await loginResponse.json();
            
            if (loginResponse.ok && loginData.user) {
              console.log(`   ✅ SUCCESS - Welcome ${loginData.user.name}`);
              workingCredentials++;
            } else {
              console.log(`   ❌ FAILED - ${loginData.message}`);
            }
          } catch (error) {
            console.log(`   ❌ ERROR - ${error.message}`);
          }
        } else {
          console.log(`${user.username}: ⏭️ SKIPPED - Missing password or expected credentials`);
        }
      }
      
      // Final summary
      console.log('');
      console.log('=' .repeat(60));
      console.log('📋 FINAL MONGODB STATUS:');
      console.log('=' .repeat(60));
      console.log(`✅ Database Connected: YES`);
      console.log(`📊 Total Users in DB: ${data.summary.totalUsers}`);
      console.log(`🔐 Working Login Credentials: ${workingCredentials}/${data.users.length}`);
      console.log(`🔒 Password Security: ${data.summary.validBcryptHashes}/${data.users.length} properly hashed`);
      
      if (workingCredentials === 4 && data.summary.totalUsers === 4) {
        console.log('');
        console.log('🎉 PERFECT! ALL 4 LOGIN CREDENTIALS ARE WORKING!');
        console.log('🌐 Your system is ready at: http://localhost:3000');
      } else {
        console.log('');
        console.log('⚠️ ISSUES DETECTED:');
        if (data.summary.totalUsers !== 4) {
          console.log(`   • Expected 4 users, found ${data.summary.totalUsers}`);
        }
        if (workingCredentials < data.users.length) {
          console.log(`   • Only ${workingCredentials}/${data.users.length} credentials working`);
        }
        console.log('🔧 Run: node scripts/final-setup.js to fix');
      }
      
    } else {
      console.log('');
      console.log('❌ NO USERS FOUND IN DATABASE');
      console.log('🔧 Run this to create users: node scripts/final-setup.js');
    }
    
  } catch (error) {
    console.error('❌ MongoDB Status Check Failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting Checklist:');
    console.log('   1. ✓ Server running: npm run dev');
    console.log('   2. ✓ MongoDB service running');
    console.log('   3. ✓ .env.local file exists');
    console.log('   4. ✓ MONGODB_URI set in .env.local');
    console.log('   5. ✓ Port 3000 accessible');
    console.log('   6. ✓ No firewall blocking connections');
  }
}

checkMongoDBStatus();