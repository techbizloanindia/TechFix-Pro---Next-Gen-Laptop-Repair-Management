const fetch = require('node-fetch');

// Test one specific credential quickly
async function quickTest() {
  const testUser = {
    username: 'Mr.Jagrit',
    password: 'Jagrit@1234',
    expectedName: 'Jagrit Madan'
  };
  
  console.log('🚀 Quick login test...');
  console.log(`Testing: ${testUser.username} / ${testUser.password}`);
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: testUser.username, 
        password: testUser.password 
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS! Login working');
      console.log(`Welcome: ${data.user.name}`);
      console.log(`Username: ${data.user.username}`);
      
      if (data.user.name === testUser.expectedName) {
        console.log('✅ Name matches expected value');
      } else {
        console.log(`⚠️ Name mismatch. Expected: ${testUser.expectedName}, Got: ${data.user.name}`);
      }
    } else {
      console.log('❌ FAILED! Login not working');
      console.log(`Error: ${data.message}`);
      
      // Try to get debug info
      console.log('\n🔍 Running diagnostic...');
      const debugResponse = await fetch('http://localhost:3000/api/debug/db-status');
      const debugData = await debugResponse.json();
      
      if (debugResponse.ok) {
        console.log(`Database users count: ${debugData.database.userCount}`);
        console.log('Available users:');
        debugData.database.users.forEach(user => {
          console.log(`  • ${user.username} → ${user.name}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('Is the server running on http://localhost:3000?');
  }
}

quickTest();