import React from 'react';

export const DebugEnv: React.FC = () => {
  const envVars = {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_WS_URL: import.meta.env.VITE_WS_URL,
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    NODE_ENV: import.meta.env.NODE_ENV
  };

  const fallbackUrl = import.meta.env.VITE_API_URL || 'https://knightsbridge-staging-v2-efus7.ondigitalocean.app';

  console.log('=== ENVIRONMENT DEBUG ===');
  console.log('All environment variables:', import.meta.env);
  console.log('Processed envVars:', envVars);
  console.log('Fallback URL would be:', fallbackUrl);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      backgroundColor: '#f5f5f5',
      border: '1px solid #ccc',
      margin: '20px'
    }}>
      <h2>🔍 Environment Variables Debug</h2>
      
      <h3>Environment Variables:</h3>
      <pre style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ddd' }}>
        {Object.entries(envVars).map(([key, value]) => 
          `${key}: ${value || 'NOT SET'}\n`
        ).join('')}
      </pre>

      <h3>Fallback Test:</h3>
      <p><strong>API URL that would be used:</strong> {fallbackUrl}</p>
      
      <h3>Full import.meta.env:</h3>
      <pre style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ddd', fontSize: '12px' }}>
        {JSON.stringify(import.meta.env, null, 2)}
      </pre>

      <h3>Test API Call:</h3>
      <button 
        onClick={() => {
          console.log('Testing API call to:', fallbackUrl);
          fetch(`${fallbackUrl}/health`)
            .then(res => res.json())
            .then(data => {
              console.log('API Response:', data);
              alert(`API Call Success! Environment: ${data.environment}, Status: ${data.status}`);
            })
            .catch(err => {
              console.error('API Error:', err);
              alert(`API Call Failed: ${err.message}`);
            });
        }}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Test API Call
      </button>
    </div>
  );
};

export default DebugEnv;
