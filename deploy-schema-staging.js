/**
 * Database Schema Deployment Script for Staging
 * Deploys the complete database schema to the DigitalOcean staging PostgreSQL database
 */

const https = require('https');

const BACKEND_URL = 'https://knightsbridge-staging-v2-efus7.ondigitalocean.app';

async function testBackendHealth() {
  console.log('🔍 Testing staging backend health...');
  
  return new Promise((resolve, reject) => {
    const req = https.get(`${BACKEND_URL}/health`, (res) => {
      console.log('📡 Health check response status:', res.statusCode);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📄 Health check response:', data);
        
        if (res.statusCode === 200) {
          console.log('✅ Staging backend is healthy and running!');
          resolve(data);
        } else {
          console.error('❌ Staging backend health check failed');
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Health check request failed:', error.message);
      reject(error);
    });
    
    req.setTimeout(30000, () => {
      console.error('❌ Health check request timeout');
      req.destroy();
      reject(new Error('Health check timeout'));
    });
  });
}

async function deploySchema() {
  console.log('🏗️ Deploying database schema to staging environment...');
  console.log('🔗 Staging Backend URL:', BACKEND_URL);
  
  return new Promise((resolve, reject) => {
    const req = https.get(`${BACKEND_URL}/deploy-schema`, (res) => {
      console.log('📡 Schema deployment response status:', res.statusCode);
      console.log('📡 Response headers:', res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📄 Schema deployment response:', data);
        
        if (res.statusCode === 200) {
          console.log('✅ Staging schema deployment successful!');
          resolve(data);
        } else {
          console.error('❌ Staging schema deployment failed with status:', res.statusCode);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Schema deployment request failed:', error.message);
      reject(error);
    });
    
    req.setTimeout(120000, () => {
      console.error('❌ Schema deployment request timeout after 120 seconds');
      req.destroy();
      reject(new Error('Schema deployment timeout'));
    });
  });
}

async function main() {
  try {
    // First test the staging backend health
    await testBackendHealth();
    
    // Then deploy the schema to staging
    await deploySchema();
    
    console.log('🎉 Staging database setup complete! You can now test the staging environment.');
    console.log('\n🔗 Staging Test URLs:');
    console.log('- Backend Health: https://knightsbridge-staging-v2-efus7.ondigitalocean.app/health');
    console.log('- Frontend: https://knightsbridge-staging.vercel.app');
    
  } catch (error) {
    console.error('❌ Staging database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if the staging backend is deployed and running');
    console.log('2. Verify the staging DATABASE_URL environment variable is set');
    console.log('3. Check DigitalOcean App Platform logs for staging app');
    console.log('4. Ensure the staging database is accessible from the app');
    console.log('5. Try accessing the health endpoint manually: https://knightsbridge-staging-v2-efus7.ondigitalocean.app/health');
    
    process.exit(1);
  }
}

main();
