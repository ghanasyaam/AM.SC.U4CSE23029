const axios = require('axios');

function Log(stack,level,package,message) {
    
  stack = stack.toLowerCase();
  level = level.toLowerCase();
  package = package.toLowerCase();

  const logObj = {
    stack,
    level,
    package,
    message
  };

  return axios.post('https://20.207.122.201/evaluation-service/logs', logObj);
}