
# Day 9 - Blue-Green Deployment

## Project
NovaPay Zero-Downtime CI/CD Pipeline

## Objective
Implement Blue-Green Deployment using Kubernetes to switch
production traffic between two application versions.

## Architecture

### Blue Environment
- Deployment: novapay-api
- Docker Image: novapay-api:day7
- Application Version: 1.0.0
- Replicas: 2
- Pod Label: app=novapay

### Green Environment
- Deployment: novapay-green
- Docker Image: novapay-api:green-v2
- Application Version: 2.0.0
- Replicas: 2
- Pod Label: app=novapay-green

## Kubernetes Service
- Service: novapay-service
- Type: NodePort
- Port: 80
- NodePort: 30081
- Target Port: 3000

## Implementation Steps
1. Verified existing Blue deployment.
2. Created a separate Green application version.
3. Built the Green Docker image.
4. Loaded the image into Minikube.
5. Created Green Kubernetes Deployment.
6. Configured health and readiness probes.
7. Tested Green application independently.
8. Switched Service selector from Blue to Green.
9. Verified Green version through production Service.
10. Rolled back Service selector from Green to Blue.
11. Verified Blue version after rollback.

## Test Results

| Test | Expected | Result |
|---|---|---|
| Blue deployment | 2/2 Ready | PASS |
| Green deployment | 2/2 Ready | PASS |
| Green version endpoint | 2.0.0 | PASS |
| Green health endpoint | UP | PASS |
| Green readiness endpoint | READY | PASS |
| Blue to Green switch | Version 2.0.0 | PASS |
| Green to Blue rollback | Version 1.0.0 | PASS |

## Final Production State
Blue environment is active.
Green environment remains available.
Both deployments have two ready replicas.

## Important Note
Traffic switching and rollback were verified through
Kubernetes Service selector changes.

Continuous load testing during traffic switching is
a separate validation task.

## Technologies
Docker, Kubernetes, Minikube, Node.js, Express,
Linux, Git and GitHub.

