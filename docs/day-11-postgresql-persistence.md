# Day 11 – PostgreSQL Integration, Persistent Storage and Backup/Restore

## 1. Objective

The objective of Day 11 was to integrate PostgreSQL with the NovaPay API, configure persistent storage in Kubernetes, securely manage database credentials, and implement database backup and restore verification.

## 2. Technologies Used

- Kubernetes
- PostgreSQL 16
- Docker
- Node.js and Express.js
- PostgreSQL Node.js package (`pg`)
- PersistentVolumeClaim (PVC)
- Kubernetes Secrets
- Argo Rollouts
- Jest and Supertest

## 3. PostgreSQL Deployment

Created a PostgreSQL 16 Deployment in Kubernetes.

**Deployment Name:** `novapay-postgres`

**Service Name:** `novapay-postgres`

**Database Name:** `novapay`

**Database User:** `novapay_admin`

**Database Port:** `5432`

A ClusterIP Service was configured to allow the NovaPay API to communicate with PostgreSQL inside the Kubernetes cluster.

## 4. Persistent Storage Configuration

Created a PersistentVolumeClaim named `novapay-postgres-pvc`.

- Storage requested: 2Gi
- Access Mode: ReadWriteOnce
- Storage Class: standard

The PostgreSQL Deployment mounts this PVC at `/var/lib/postgresql/data`.

Verified data persistence by recreating the PostgreSQL Pod and checking that the existing account records remained available.

## 5. Database Schema

Created an `accounts` table with the following columns:

| Column | Data Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| account_holder | VARCHAR(100) |
| balance | DECIMAL(12,2) |
| created_at | TIMESTAMP |
| account_type | VARCHAR(30) |
| currency | VARCHAR(10) |

Inserted two sample account records:

- Rahul Sharma – Savings – INR – 5000.00
- Priya Singh – Current – INR – 10000.00

## 6. Database Credentials Management

Created a Kubernetes Secret named `novapay-postgres-secret`.

The Secret stores:

- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD

The NovaPay API retrieves database credentials through Kubernetes Secret references.

The actual Secret manifest is excluded from Git using `.gitignore`. A placeholder example manifest is maintained for reference.

## 7. NovaPay API Integration

Installed the PostgreSQL Node.js package (`pg`).

Created `app/src/config/db.js` to configure a PostgreSQL connection pool.

Updated the accounts route to fetch account records directly from PostgreSQL.

**API Endpoint:**

`GET /api/accounts`

The API returns account details in JSON format.

**Verification Result:**

- HTTP Status: 200 OK
- Total Accounts: 2
- Database connection: Successful

The API was verified through the Kubernetes stable Service.

## 8. Argo Rollouts Integration

Updated the NovaPay progressive rollout configuration to use the PostgreSQL-integrated application image:

`novapay-api:green-v3-db`

Configured the following environment variables:

- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD

The canary rollout successfully reached Healthy status with 100% traffic assigned to the new revision.

## 9. Database Backup

Created a PostgreSQL logical backup using `pg_dump`.

```bash
mkdir -p /tmp/novapay-backups

kubectl exec deployment/novapay-postgres -- \
  pg_dump -U novapay_admin -d novapay \
  > /tmp/novapay-backups/novapay-backup.sql
```

Verified that the SQL backup file was created successfully.

## 10. Database Restore Verification

Created a separate test database:

```bash
kubectl exec deployment/novapay-postgres -- \
  psql -U novapay_admin -d postgres \
  -c "CREATE DATABASE novapay_restore_test;"
```

Restored the backup:

```bash
kubectl exec -i deployment/novapay-postgres -- \
  psql -U novapay_admin -d novapay_restore_test \
  < /tmp/novapay-backups/novapay-backup.sql
```

Verified restored records:

```bash
kubectl exec deployment/novapay-postgres -- \
  psql -U novapay_admin -d novapay_restore_test \
  -c "SELECT * FROM accounts;"
```

**Result:** Both account records were successfully restored and verified in the test database.

The original database was not overwritten.

## 11. Automated Testing

Executed Jest tests:

```bash
npm test -- --runInBand
```

**Test Results:**

- Test Suites: 4 passed
- Tests: 5 passed
- Failed: 0

Accounts API tests use a mocked PostgreSQL connection pool to test successful responses and database-error handling independently of a local database server.

## 12. Security Considerations

- Database credentials are stored in Kubernetes Secrets.
- Actual Secret YAML is excluded from Git.
- No database passwords are included in this documentation.
- SQL backup files are stored outside the Git repository.
- Production environments should use stronger secret-management practices.

## 13. Day 11 Outcome

Successfully integrated PostgreSQL with the NovaPay API.

Implemented persistent database storage using Kubernetes PVC, verified database persistence across Pod recreation, and successfully tested database backup and restore.

The PostgreSQL-integrated API was deployed through Argo Rollouts and all five automated tests passed.

**Day 11 Status: Completed**

