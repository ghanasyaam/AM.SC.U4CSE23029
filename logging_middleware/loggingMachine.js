const axios = require('axios');

const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbS5zYy51NGNzZTIzMDI5QGFtLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjM3NzMsImlhdCI6MTc3ODA2Mjg3MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjE4YTExOTg0LTk0YWQtNGU5OS04ZGQzLTE5ZmM4NmY2Y2QyYSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImdoYW5hc3lhbSBzLnN1bmlsIiwic3ViIjoiZjY4MDA1ZGYtOWIzMy00ODg4LTk5NjAtMzhlN2QwMjQ2NGM4In0sImVtYWlsIjoiYW0uc2MudTRjc2UyMzAyOUBhbS5zdHVkZW50cy5hbXJpdGEuZWR1IiwibmFtZSI6ImdoYW5hc3lhbSBzLnN1bmlsIiwicm9sbE5vIjoiYW0uc2MudTRjc2UyMzAyOSIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6ImY2ODAwNWRmLTliMzMtNDg4OC05OTYwLTM4ZTdkMDI0NjRjOCIsImNsaWVudFNlY3JldCI6Ikt5bnNjQUVqWWZTZWFQamcifQ.qkBS_rXYlhdW1h8V3CVNrmll39xzVyOa9j90xc5InFs';
const https = require('https');

const agent = new https.Agent({
    rejectUnauthorized: false
});

function Log(stack, level, packageName, message) {
    
  stack = String(stack).toLowerCase();
  if (stack !== 'backend' && stack !== 'frontend') {
    stack = 'backend';
  }

  level = String(level).toLowerCase();
  packageName = String(packageName).toLowerCase();
  if (!['cache', 'controller', 'cron_job', 'db', 'domain'].includes(packageName)) {
    packageName = 'cron_job';
  }

  message = String(message).slice(0, 48);

  const logObj = {
    stack,
    level,
    package: packageName,
    message
  };

  return axios.post('https://20.207.122.201/evaluation-service/logs', logObj, {
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).catch(error => {
    console.error('LoggingMachine failed:', error.response?.data || error.message);
  });
}

module.exports = { Log };