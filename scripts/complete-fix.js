const fetch = require('node-fetch');

async function completeFix() {
  console.log('🔧 COMPLETE SYSTEM FIX');
  console.log('='.repeat(50));
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Step 1: Complete reset
    console.log('\n📋 Step 1: Complete database reset...');
    const resetResponse = await fetch(`${baseUrl}/api/auth/complete-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const resetData = await resetResponse.json();
    console.log('Reset response status:', resetResponse.status);
    console.log('Reset response:', resetData);
    
    if (!resetResponse.ok) {
      throw new Error(`Reset failed: ${resetData.message}`);
    }
    
    console.log('✅ Reset successful');
    console.log(`   • Created ${resetData.totalUsers} users`);
    console.log(`   • All passwords work: ${resetData.allPasswordsWork}`);
    
    // Step 2: Test each login
    console.log('\n📋 Step 2: Testing each login credential...');
    
    const credentials = [
      { username: 'Mr.Jagrit', password: 'Jagrit@1234', name: 'Jagrit Madan' },
      { username: 'Mr.Aashish', password: 'Aashish@1234', name: 'Aashish Srivastava' },
      { username: 'Mr.Chandrakant', password: 'Chandrakant@1234', name: 'Chandra Kant' },
      { username: 'Mr.Nitish', password: 'Nitish@1234', name: 'Nitish Kumar' }
    ];
    
    const results = [];
    
    for (const cred of credentials) {
      console.log(`\n🧪 Testing: ${cred.username}`);
      
      try {
        // Try simple login API
        const loginResponse = await fetch(`${baseUrl}/api/auth/simple-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: cred.username,
            password: cred.password
          })
        });
        
        const loginData = await loginResponse.json();
        
        if (loginResponse.ok) {
          console.log(`✅ SUCCESS: ${cred.username} → ${loginData.user.name}`);
          results.push({ ...cred, status: 'SUCCESS', response: loginData });
        } else {
          console.log(`❌ FAILED: ${cred.username} → ${loginData.message}`);
          if (loginData.debug) {
            console.log(`   Available users: ${loginData.debug.availableUsers.join(', ')}`);
          }
          results.push({ ...cred, status: 'FAILED', error: loginData.message });
        }
        
      } catch (error) {
        console.log(`❌ ERROR: ${cred.username} → ${error.message}`);
        results.push({ ...cred, status: 'ERROR', error: error.message });
      }
    }
    
    // Step 3: Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL RESULTS');
    console.log('='.repeat(50));
    
    const successful = results.filter(r => r.status === 'SUCCESS');
    const failed = results.filter(r => r.status !== 'SUCCESS');
    
    console.log(`✅ Successful logins: ${successful.length}/${results.length}`);
    console.log(`❌ Failed logins: ${failed.length}/${results.length}`);
    
    if (successful.length === 4) {
      console.log('\n🎉 ALL LOGINS WORKING! SYSTEM IS READY!');
      console.log('\n🔐 Working credentials:');
      successful.forEach(cred => {
        console.log(`   • ${cred.username} / ${cred.password} → ${cred.name}`);
      });
      console.log('\n🌐 Access: http://localhost:3000');
      console.log('📱 Login page will automatically load');
    } else {
      console.log('\n⚠️ Some logins still not working:');
      failed.forEach(cred => {
        console.log(`   • ${cred.username}: ${cred.error || cred.status}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ COMPLETE FIX FAILED:', error.message);
    console.log('\n🔧 Check:');
    console.log('   1. Server running: npm run dev');
    console.log('   2. MongoDB running and accessible');
    console.log('   3. Port 3000 not blocked');
    console.log('   4. Environment variables set correctly');
  }
}

completeFix();