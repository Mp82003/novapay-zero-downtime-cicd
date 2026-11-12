
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
                        echo "Running dependency security audit..."

                        npm audit --json > npm-audit-report.json || {
                            echo "WARNING: npm audit could not complete."
                            echo "Check npm audit report later."
                        }

                        echo "Continuing pipeline..."
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

                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.sources=app/src \
                            -Dsonar.tests=app/tests \
                            -Dsonar.test.inclusions=app/tests/**/*.test.js
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
                    set -eu

                    docker rm -f ${DAST_CONTAINER} 2>/dev/null || true

                    docker run -d \
                        --name ${DAST_CONTAINER} \
                        --network ${DOCKER_NETWORK} \
                        ${APP_IMAGE}

                    echo "Waiting for application health..."

                    for i in $(seq 1 30); do
                        if docker run --rm \
                            --network ${DOCKER_NETWORK} \
                            curlimages/curl:latest \
                            -fsS http://${DAST_CONTAINER}:3000/health; then

                            echo "Application is healthy."
                            exit 0
                        fi

                        sleep 2
                    done

                    echo "ERROR: Application health check failed."
                    docker logs ${DAST_CONTAINER}
                    exit 1
                '''
            }
        }

        stage('OWASP ZAP DAST Scan') {
            steps {
                sh '''
                    set -eu

                    REPORT_DIR="$WORKSPACE/security/reports"

                    HTML_REPORT="day7-jenkins-zap-report.html"
                    JSON_REPORT="day7-jenkins-zap-report.json"

                    case "$WORKSPACE" in
                        /var/jenkins_home/*)
                            WORKSPACE_REL="${WORKSPACE#/var/jenkins_home/}"
                            ;;
                        *)
                            echo "ERROR: Workspace is outside /var/jenkins_home."
                            echo "Workspace: $WORKSPACE"
                            exit 1
                            ;;
                    esac

                    ZAP_REPORT_DIR="/zap/wrk/$WORKSPACE_REL/security/reports"

                    mkdir -p "$REPORT_DIR"

                    rm -f "$REPORT_DIR/$HTML_REPORT"
                    rm -f "$REPORT_DIR/$JSON_REPORT"

                    echo "Jenkins report directory: $REPORT_DIR"
                    echo "ZAP report directory: $ZAP_REPORT_DIR"

                    echo "Starting OWASP ZAP baseline scan..."

                    set +e

                    docker run --rm \
                        --user 0:0 \
                        --network ${DOCKER_NETWORK} \
                        -v jenkins_home:/zap/wrk:rw \
                        ghcr.io/zaproxy/zaproxy:stable \
                        zap-baseline.py \
                        --autooff \
                        -t http://${DAST_CONTAINER}:3000/health \
                        -r "$ZAP_REPORT_DIR/$HTML_REPORT" \
                        -J "$ZAP_REPORT_DIR/$JSON_REPORT"

                    ZAP_EXIT_CODE=$?

                    set -e

                    echo "ZAP exit code: $ZAP_EXIT_CODE"

                    if [ "$ZAP_EXIT_CODE" -ne 0 ] && [ "$ZAP_EXIT_CODE" -ne 2 ]; then
                        echo "ERROR: ZAP scan failed."
                        exit "$ZAP_EXIT_CODE"
                    fi

                    echo "Checking generated reports..."

                    find "$REPORT_DIR" -maxdepth 2 -type f \
                        -printf '%p (%s bytes)\\n'

                    if [ ! -s "$REPORT_DIR/$HTML_REPORT" ]; then
                        echo "ERROR: HTML report missing or empty."
                        exit 1
                    fi

                    if [ ! -s "$REPORT_DIR/$JSON_REPORT" ]; then
                        echo "ERROR: JSON report missing or empty."
                        exit 1
                    fi

                    echo "HTML report generated successfully."
                    echo "JSON report generated successfully."
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

