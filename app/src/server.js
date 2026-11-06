// Import Express application from app.js
const app = require('./app');

// Define server port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`NovaPay server running on port ${PORT}`);
});
