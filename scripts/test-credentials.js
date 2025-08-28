const fetch = require('node-fetch');

const credentials = [
  { username: 'Mr.Jagrit', password: 'Jagrit@1234', name: 'Jagrit Madan' },
  { username: 'Mr.Aashish', password: 'Aashish@1234', name: 'Aashish Srivastava' },
  { username: 'Mr.Chandrakant', password: 'Chandrakant@1234', name: 'Chandra Kant' },
  { username: 'Mr.Nitish', password: 'Nitish@1234', name: 'Nitish Kumar' }
];

async function testCredentials() {
  console.log('🧪 Testing all login credentials...\n');
  
  for (const cred of credentials) {
    console.log(`Testing: ${cred.username} → ${cred.name}`);
    console.log(`Password: ${cred.password}`);
    
    try {
      // Test with debug API first
      const debugResponse = await fetch('http://localhost:3000/api/debug/test-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cred.username, password: cred.password }),
      });

      const debugData = await debugResponse.json();
      
      if (debugResponse.ok) {
        console.log('✅ Debug test passed');
        console.log(`   • Direct bcrypt compare: ${debugData.debug.directBcryptCompare}`);
        console.log(`   • Method compare: ${debugData.debug.methodCompare}`);
        
        // Now test actual login
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cred.username, password: cred.password }),
        });

        const loginData = await loginResponse.json();
        
        if (loginResponse.ok) {
          console.log('✅ LOGIN SUCCESSFUL');
          console.log(`   • Welcome: ${loginData.user.name}`);
        } else {
          console.log('❌ LOGIN FAILED');
          console.log(`   • Error: ${loginData.message}`);
        }
      } else {
        console.log('❌ Debug test failed');
        console.log(`   • Error: ${debugData.message}`);
        if (debugData.availableUsers) {
          console.log('   • Available users:');
          debugData.availableUsers.forEach(u => console.log(`     - ${u.username} → ${u.name}`));
        }
      }
      
    } catch (error) {
      console.error('❌ Network error:', error.message);
    }
    
    console.log('─'.repeat(50));
  }
}

testCredentials();