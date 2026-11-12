
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    environment {
        APP_IMAGE = 'novapay-api:day7'
        DAST_CONTAINER = 'novapay-dast-target'
        DOCKER_NETWORK = 'novapay-network'
        SONAR_PROJECT_KEY = 'NoivaPay-API'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh 'npm ci'
                }
            }
        }

        stage('Dependency Security Scan') {
            steps {
                dir('app') {
                    sh '''
                        npm audit --json > npm-audit-report.json || true
                        npm audit --audit-level=high
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('app') {
                    sh 'npm test -- --runInBand'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    echo "SonarScanner path: ${scannerHome}"

                    withSonarQubeEnv('SonarQube') {
                        sh """
                            "${scannerHome}/bin/sonar-scanner" \
                              -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                              -Dsonar.sources=app/src \
                              -Dsonar.tests=app/tests \
                              -Dsonar.test.inclusions=app/tests/**/*.test.js \
                              -Dsonar.javascript.lcov.reportPaths=app/coverage/lcov.info
                        """
                    }
                }
            }
        }

        stage('Build API Docker Image') {
            steps {
                sh 'docker build -t ${APP_IMAGE} ./app'
            }
        }

        stage('Start DAST Target') {
            steps {
                sh '''
                    docker rm -f ${DAST_CONTAINER} 2>/dev/null || true

                    docker run -d \
                      --name ${DAST_CONTAINER} \
                      --network ${DOCKER_NETWORK} \
                      ${APP_IMAGE}

                    echo "Waiting for API to become healthy..."

                    for i in $(seq 1 30); do
                        if docker exec ${DAST_CONTAINER} \
                            node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
                        then
                            echo "API is healthy."
                            exit 0
                        fi

                        sleep 2
                    done

                    echo "API failed to become healthy."
                    docker logs ${DAST_CONTAINER}
                    exit 1
                '''
            }
        }

        stage('OWASP ZAP DAST Scan') {
            steps {
                sh '''
                    mkdir -p "$WORKSPACE/security/reports"

                    set +e

                    docker run --rm \
                      --user 0:0 \
                      --network ${DOCKER_NETWORK} \
                      -v "$WORKSPACE/security/reports:/zap/wrk:rw" \
                      ghcr.io/zaproxy/zaproxy:stable \
                      zap-baseline.py \
                      -t http://${DAST_CONTAINER}:3000/health \
                      -r day7-jenkins-zap-report.html \
                      -J day7-jenkins-zap-report.json

                    ZAP_EXIT_CODE=$?

                    set -e

                    if [ "$ZAP_EXIT_CODE" -eq 0 ]; then
                        echo "ZAP scan completed successfully."
                    elif [ "$ZAP_EXIT_CODE" -eq 2 ]; then
                        echo "ZAP scan completed with warnings. No new FAIL alerts."
                    else
                        echo "ZAP scan failed with exit code: $ZAP_EXIT_CODE"
                        exit "$ZAP_EXIT_CODE"
                    fi

                    echo "Checking generated ZAP reports..."

                    test -s "$WORKSPACE/security/reports/day7-jenkins-zap-report.html"
                    test -s "$WORKSPACE/security/reports/day7-jenkins-zap-report.json"

                    echo "Both ZAP reports generated successfully."

                    ls -lh "$WORKSPACE/security/reports/"
                '''
            }
        }
    }

    post {
        always {
            sh '''
                docker rm -f ${DAST_CONTAINER} 2>/dev/null || true
            '''

            archiveArtifacts artifacts: 'app/npm-audit-report.json,security/reports/*',
                             allowEmptyArchive: true
        }

        success {
            echo 'NovaPay CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'NovaPay CI/CD pipeline failed. Check the console output.'
        }
    }
}

