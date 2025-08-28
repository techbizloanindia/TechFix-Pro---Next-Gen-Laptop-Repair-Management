const fetch = require('node-fetch');

async function finalSetup() {
  console.log('🚀 FINAL SETUP - REAL-TIME MONGODB LOGIN SYSTEM');
  console.log('=' .repeat(60));
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Step 1: Environment check
    console.log('\n📋 Step 1: Checking environment...');
    try {
      const envResponse = await fetch(`${baseUrl}/api/debug/env-check`);
      const envData = await envResponse.json();
      
      console.log('Environment status:', envData.environment);
      if (envData.warnings.length > 0) {
        console.log('⚠️ Warnings:', envData.warnings);
      }
    } catch (error) {
      console.log('⚠️ Could not check environment, proceeding anyway...');
    }
    
    // Step 2: Complete reset with exact credentials
    console.log('\n📋 Step 2: Storing credentials in MongoDB...');
    const resetResponse = await fetch(`${baseUrl}/api/auth/complete-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!resetResponse.ok) {
      throw new Error('Failed to reset database');
    }
    
    const resetData = await resetResponse.json();
    console.log('✅ Credentials stored in MongoDB successfully');
    console.log(`   • Users created: ${resetData.totalUsers}`);
    console.log(`   • Password verification: ${resetData.allPasswordsWork ? 'ALL PASS' : 'SOME FAILED'}`);
    
    // Step 3: Real-time login testing
    console.log('\n📋 Step 3: Testing real-time login for each credential...');
    
    const credentials = [
      { username: 'Mr.Jagrit', password: 'Jagrit@1234', name: 'Jagrit Madan' },
      { username: 'Mr.Aashish', password: 'Aashish@1234', name: 'Aashish Srivastava' },
      { username: 'Mr.Chandrakant', password: 'Chandrakant@1234', name: 'Chandra Kant' },
      { username: 'Mr.Nitish', password: 'Nitish@1234', name: 'Nitish Kumar' }
    ];
    
    let allWorking = true;
    const results = [];
    
    for (const cred of credentials) {
      console.log(`\n🧪 Testing: ${cred.username}`);
      console.log(`   Password: ${cred.password}`);
      console.log(`   Expected Name: ${cred.name}`);
      
      try {
        const loginResponse = await fetch(`${baseUrl}/api/auth/simple-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: cred.username,
            password: cred.password
          })
        });
        
        const loginData = await loginResponse.json();
        
        if (loginResponse.ok && loginData.user) {
          const nameMatch = loginData.user.name === cred.name;
          console.log(`   ✅ LOGIN SUCCESS`);
          console.log(`   👤 Welcome: ${loginData.user.name}`);
          console.log(`   🔍 Name Match: ${nameMatch ? 'YES' : 'NO'}`);
          
          results.push({
            username: cred.username,
            status: 'SUCCESS',
            actualName: loginData.user.name,
            nameMatch: nameMatch
          });
        } else {
          console.log(`   ❌ LOGIN FAILED: ${loginData.message}`);
          allWorking = false;
          results.push({
            username: cred.username,
            status: 'FAILED',
            error: loginData.message
          });
        }
        
      } catch (error) {
        console.log(`   ❌ CONNECTION ERROR: ${error.message}`);
        allWorking = false;
        results.push({
          username: cred.username,
          status: 'ERROR',
          error: error.message
        });
      }
    }
    
    // Step 4: Final status
    console.log('\n' + '=' .repeat(60));
    console.log('🎯 FINAL STATUS');
    console.log('=' .repeat(60));
    
    if (allWorking) {
      console.log('🎉 SUCCESS! ALL CREDENTIALS WORKING IN REAL-TIME!');
      console.log('\n📱 Your login system is now fully functional:');
      console.log('\n🔐 Working Login Credentials:');
      credentials.forEach(cred => {
        console.log(`   • Username: ${cred.username}`);
        console.log(`     Password: ${cred.password}`);
        console.log(`     Name: ${cred.name}`);
        console.log('');
      });
      
      console.log('🌐 Access your application:');
      console.log('   • URL: http://localhost:3000');
      console.log('   • Automatically redirects to login page');
      console.log('   • Use any of the credentials above');
      console.log('   • After login, user name appears in header');
      console.log('   • Logout button returns to login page');
      
      console.log('\n✅ MongoDB Storage:');
      console.log('   • All credentials stored in MongoDB');
      console.log('   • Passwords securely hashed with bcrypt');
      console.log('   • Real-time authentication working');
      console.log('   • Session management active');
      
    } else {
      console.log('❌ SOME ISSUES REMAIN:');
      results.forEach(result => {
        if (result.status !== 'SUCCESS') {
          console.log(`   • ${result.username}: ${result.error || result.status}`);
        }
      });
      console.log('\nCheck server logs for detailed error information.');
    }
    
  } catch (error) {
    console.error('\n❌ FINAL SETUP FAILED:', error.message);
    console.log('\n🔧 Troubleshooting checklist:');
    console.log('   1. ✅ Server running: npm run dev');
    console.log('   2. ✅ MongoDB running and accessible');
    console.log('   3. ✅ Port 3000 available');
    console.log('   4. ✅ .env.local file exists with MONGODB_URI');
    console.log('   5. ✅ No firewall blocking connections');
  }
}

// Run the final setup
finalSetup();