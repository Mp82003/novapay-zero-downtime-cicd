
const app = require('./app-green');

const PORT = process.env.PORT || 3000;

// Start Green API server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`NovaPay Green API running on port ${PORT}`);
    console.log('Version: green-v3');
    console.log(`Port: ${PORT}`);
});

