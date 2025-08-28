const fetch = require('node-fetch');

async function testDatabase() {
  try {
    console.log('🧪 Testing database connection...');
    
    const response = await fetch('http://localhost:3000/api/debug/db-status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Database connection successful!');
      console.log('📊 Database Status:');
      console.log(`   • Connected: ${data.database.connected}`);
      console.log(`   • User Count: ${data.database.userCount}`);
      console.log('👥 Users:');
      data.database.users.forEach(user => {
        console.log(`   • ${user.username} → ${user.name} (ID: ${user.id})`);
      });
    } else {
      console.log('❌ Database connection failed:', data.message);
      if (data.error) {
        console.log('Error details:', data.error);
      }
    }
  } catch (error) {
    console.error('❌ Error testing database:', error.message);
    console.log('Make sure the server is running on http://localhost:3000');
  }
}

testDatabase();