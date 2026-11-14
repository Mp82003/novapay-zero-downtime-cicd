const app = require('./app-green');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`NovaPay GREEN server running on port ${PORT}`);
});
