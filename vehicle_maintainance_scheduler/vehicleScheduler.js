LoggingMachine = require('../logging_middleware/loggingMachine.js');

const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
    rejectUnauthorized: false
});

const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbS5zYy51NGNzZTIzMDI5QGFtLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjM3NzMsImlhdCI6MTc3ODA2Mjg3MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjE4YTExOTg0LTk0YWQtNGU5OS04ZGQzLTE5ZmM4NmY2Y2QyYSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImdoYW5hc3lhbSBzLnN1bmlsIiwic3ViIjoiZjY4MDA1ZGYtOWIzMy00ODg4LTk5NjAtMzhlN2QwMjQ2NGM4In0sImVtYWlsIjoiYW0uc2MudTRjc2UyMzAyOUBhbS5zdHVkZW50cy5hbXJpdGEuZWR1IiwibmFtZSI6ImdoYW5hc3lhbSBzLnN1bmlsIiwicm9sbE5vIjoiYW0uc2MudTRjc2UyMzAyOSIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6ImY2ODAwNWRmLTliMzMtNDg4OC05OTYwLTM4ZTdkMDI0NjRjOCIsImNsaWVudFNlY3JldCI6Ikt5bnNjQUVqWWZTZWFQamcifQ.qkBS_rXYlhdW1h8V3CVNrmll39xzVyOa9j90xc5InFs';

async function scheduleMaintenance() {

    const response = await axios.get('https://20.207.122.201/evaluation-service/depots', { 
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const depots = response.data.depots || response.data;

    LoggingMachine.Log('backend', 'info', 'cron_job', 'Fetched depots.');

    const vehiclesResponse = await axios.get('https://20.207.122.201/evaluation-service/vehicles', { 
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const vehicles = vehiclesResponse.data.vehicles || vehiclesResponse.data;

    LoggingMachine.Log('backend', 'info', 'cron_job', 'Fetched vehicles.');

    const totalMechanicHours = depots.reduce((sum, depot) => sum + depot.MechanicHours, 0);
    const n = vehicles.length;
    const dp = Array.from({ length: n + 1 }, () => Array(totalMechanicHours + 1).fill(0)); // dp[i][w] will hold the maximum impact for the first i vehicles with w mechanic hours

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= totalMechanicHours; w++) {
            if (vehicles[i - 1].Duration <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - vehicles[i - 1].Duration] + vehicles[i - 1].Impact); // as impact is the value we want to maximize
            } else {
                dp[i][w] = dp[i - 1][w]; // if the vehicle's duration exceeds the current mechanic hours, we cant include it
            }
        }
    }

    const selectedVehicles = [];
    let w = totalMechanicHours;

    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selectedVehicles.push(vehicles[i - 1]); // this vehicle is included in the optimal solution
            w -= vehicles[i - 1].Duration; // reduce the remaining mechanic hours by the duration of the selected vehicle
        }
    }

    LoggingMachine.Log('backend', 'info', 'cron_job', 'Scheduled maintenance complete.');
    console.log('Selected Vehicles:', selectedVehicles);

}

scheduleMaintenance();

