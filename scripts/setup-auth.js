const fetch = require('node-fetch');

async function setupAuthentication() {
  console.log('🚀 Setting up TechFix Pro Authentication System...\n');
  
  try {
    // Step 1: Test database connection
    console.log('Step 1: Testing database connection...');
    const dbResponse = await fetch('http://localhost:3000/api/debug/db-status');
    const dbData = await dbResponse.json();
    
    if (dbResponse.ok) {
      console.log('✅ Database connected successfully');
      console.log(`   • User Count: ${dbData.database.userCount}`);
      
      if (dbData.database.userCount === 0) {
        console.log('\nStep 2: No users found, creating default users...');
        
        // Step 2: Create users if none exist
        const userResponse = await fetch('http://localhost:3000/api/auth/init-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        const userData = await userResponse.json();
        
        if (userResponse.ok) {
          console.log('✅ Default users created successfully');
          console.log(`   • Created ${userData.count} users`);
        } else {
          console.log('⚠️ Users may already exist:', userData.message);
        }
      } else {
        console.log('\n✅ Users already exist in database');
        console.log('👥 Current users:');
        dbData.database.users.forEach(user => {
          console.log(`   • ${user.username} → ${user.name}`);
        });
      }
      
      console.log('\n🎉 Authentication system ready!');
      console.log('\n📋 Login Credentials:');
      console.log('   • Username: Mr.Jagrit     | Password: Jagrit@1234     | Name: Jagrit Madan');
      console.log('   • Username: Mr.Aashish    | Password: Aashish@1234    | Name: Aashish Srivastava');
      console.log('   • Username: Mr.Chandrakant| Password: Chandrakant@1234| Name: Chandra Kant');
      console.log('   • Username: Mr.Nitish     | Password: Nitish@1234     | Name: Nitish Kumar');
      console.log('\n🌐 Access the application at: http://localhost:3000');
      console.log('🔒 You will be redirected to login page automatically');
      
    } else {
      console.log('❌ Database connection failed:', dbData.message);
      console.log('\n🔧 Troubleshooting:');
      console.log('   1. Make sure MongoDB is running');
      console.log('   2. Check your .env.local file has correct MONGODB_URI');
      console.log('   3. Verify the database connection string');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Make sure:');
    console.log('   1. The server is running: npm run dev');
    console.log('   2. MongoDB is running and accessible');
    console.log('   3. Environment variables are set correctly');
  }
}

setupAuthentication();