const client = require('@prometheus-io/client');

// Collect Node.js and process metrics
client.collectDefaultMetrics({
    register: client.register,
    prefix: 'novapay_'
});

// Total HTTP requests
const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

// HTTP request duration
const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

// Middleware
function metricsMiddleware(req, res, next) {
    if (req.path === '/metrics') return next();

    const start = process.hrtime.bigint();

    res.on('finish', () => {
        const duration =
            Number(process.hrtime.bigint() - start) / 1e9;

        const route = req.baseUrl + (req.route?.path || 'unmatched');

        const labels = {
            method: req.method,
            route,
            status_code: String(res.statusCode)
        };

        httpRequestsTotal.inc(labels);
        httpRequestDuration.observe(labels, duration);
    });

    next();
}

// Metrics endpoint handler
async function metricsHandler(req, res) {
    try {
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    } catch (error) {
        res.status(500).send('Unable to collect metrics');
    }
}

module.exports = {
    metricsMiddleware,
    metricsHandler
};
