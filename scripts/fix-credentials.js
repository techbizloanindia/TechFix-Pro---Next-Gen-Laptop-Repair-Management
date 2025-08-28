const fetch = require('node-fetch');

async function fixCredentials() {
  console.log('🔧 Fixing login credentials issue...\n');
  
  try {
    console.log('Step 1: Force reset all users with proper password hashing...');
    const resetResponse = await fetch('http://localhost:3000/api/auth/force-reset-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const resetData = await resetResponse.json();
    
    if (resetResponse.ok) {
      console.log('✅ Users reset successfully');
      console.log('Password verification tests:');
      resetData.users.forEach(user => {
        const status = user.passwordTest ? '✅ PASS' : '❌ FAIL';
        console.log(`   • ${user.username} → ${user.name}: ${status}`);
      });
      
      console.log('\nStep 2: Testing login for all credentials...');
      
      const credentials = [
        { username: 'Mr.Jagrit', password: 'Jagrit@1234', name: 'Jagrit Madan' },
        { username: 'Mr.Aashish', password: 'Aashish@1234', name: 'Aashish Srivastava' },
        { username: 'Mr.Chandrakant', password: 'Chandrakant@1234', name: 'Chandra Kant' },
        { username: 'Mr.Nitish', password: 'Nitish@1234', name: 'Nitish Kumar' }
      ];

      let allPassed = true;
      
      for (const cred of credentials) {
        try {
          const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: cred.username, password: cred.password }),
          });

          const loginData = await loginResponse.json();
          
          if (loginResponse.ok) {
            console.log(`✅ ${cred.username} → Login successful (Welcome ${loginData.user.name})`);
          } else {
            console.log(`❌ ${cred.username} → Login failed: ${loginData.message}`);
            allPassed = false;
          }
        } catch (error) {
          console.log(`❌ ${cred.username} → Network error: ${error.message}`);
          allPassed = false;
        }
      }
      
      console.log('\n' + '='.repeat(60));
      if (allPassed) {
        console.log('🎉 ALL CREDENTIALS WORKING! Login system is now functional.');
        console.log('\n📋 Working Credentials:');
        credentials.forEach(cred => {
          console.log(`   • Username: ${cred.username}`);
          console.log(`     Password: ${cred.password}`);
          console.log(`     Name: ${cred.name}\n`);
        });
        console.log('🌐 Access the application at: http://localhost:3000');
      } else {
        console.log('❌ Some credentials still not working. Check the logs above.');
      }
      
    } else {
      console.log('❌ Failed to reset users:', resetData.message);
    }
    
  } catch (error) {
    console.error('❌ Fix script error:', error.message);
    console.log('\nMake sure:');
    console.log('1. Server is running: npm run dev');
    console.log('2. MongoDB is running and accessible');
    console.log('3. Environment variables are set correctly');
  }
}

fixCredentials();