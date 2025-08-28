const fetch = require('node-fetch');

// Initialize users by calling the init-users API
async function initializeUsers() {
  try {
    console.log('Initializing default users...');
    
    const response = await fetch('http://localhost:3000/api/auth/init-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success:', data.message);
      console.log(`Created ${data.count} users`);
    } else {
      console.log('⚠️ Warning:', data.message);
    }
  } catch (error) {
    console.error('❌ Error initializing users:', error.message);
    console.log('Make sure the server is running on http://localhost:3000');
  }
}

initializeUsers();