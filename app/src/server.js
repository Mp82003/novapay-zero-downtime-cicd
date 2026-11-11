const app = require('./app');

// Disable Express version disclosure
app.disable('x-powered-by');

// Define server port
const PORT = process.env.PORT || 3000;
