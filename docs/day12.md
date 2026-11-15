# Day 12 - Monitoring and Observability

## Objective
Implemented monitoring for NovaPay API using Prometheus and Grafana.

## Tools Used
- Prometheus
- Grafana
- Docker
- Node.js
- PromQL

## Implementation
1. Integrated Prometheus metrics into NovaPay API.
2. Created HTTP request counter.
3. Created HTTP request duration histogram.
4. Exposed /metrics endpoint.
5. Configured Prometheus scraping.
6. Connected Grafana with Prometheus.
7. Created NovaPay monitoring dashboard.

## Dashboard Panels
- Total HTTP Requests
- HTTP Request Rate
- P95 API Response Time
- Application Memory Usage

## Result
Prometheus target: UP (1/1)
Grafana datasource: Connected
NovaPay API metrics: Successfully collected
