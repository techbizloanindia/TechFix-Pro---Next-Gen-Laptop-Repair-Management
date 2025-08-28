const fetch = require('node-fetch');

// Reset and recreate users with correct names
async function resetUsers() {
  try {
    console.log('🔄 Resetting users with correct names...');
    
    const response = await fetch('http://localhost:3000/api/auth/reset-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success:', data.message);
      console.log('👥 Updated users:');
      data.users.forEach(user => {
        console.log(`   • Username: ${user.username} → Name: ${user.name}`);
      });
    } else {
      console.log('❌ Error:', data.message);
    }
  } catch (error) {
    console.error('❌ Error resetting users:', error.message);
    console.log('Make sure the server is running on http://localhost:3000');
  }
}

resetUsers();