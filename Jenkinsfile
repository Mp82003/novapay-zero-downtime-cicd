
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    environment {
        API_IMAGE = 'novapay-api:day7'
        DAST_CONTAINER = 'novapay-dast-target'
        DOCKER_NETWORK = 'novapay-network'
        ZAP_IMAGE = 'ghcr.io/zaproxy/zaproxy:stable'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Mp82003/novapay-zero-downtime-cicd.git'
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
                    '''

                    sh 'npm audit --audit-level=high'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('app') {
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Build API Docker Image') {
            steps {
                sh '''
                    docker build -t ${API_IMAGE} ./app
                '''
            }
        }

        stage('Start DAST Target') {
            steps {
                sh '''
                    docker rm -f ${DAST_CONTAINER} || true

                    docker run -d \
                        --name ${DAST_CONTAINER} \
                        --network ${DOCKER_NETWORK} \
                        ${API_IMAGE}

                    sleep 5

                    docker exec ${DAST_CONTAINER} \
                        wget -qO- http://localhost:3000/health
                '''
            }
        }

        stage('OWASP ZAP DAST Scan') {
            steps {
                sh '''
                    mkdir -p security/reports
                    chmod 777 security/reports

                    set +e

                    docker run --rm \
                        --user 0:0 \
                        --network ${DOCKER_NETWORK} \
                        -v "$WORKSPACE/security/reports:/zap/wrk/:rw" \
                        ${ZAP_IMAGE} \
                        zap-baseline.py \
                        -t http://${DAST_CONTAINER}:3000/health \
                        -r day7-jenkins-zap-report.html \
                        -J day7-jenkins-zap-report.json

                    ZAP_STATUS=$?

                    set -e

                    echo "ZAP exit code: ${ZAP_STATUS}"

                    if [ "$ZAP_STATUS" -eq 2 ]; then
                        echo "ZAP completed with warnings."
                        echo "Review the generated security reports."

                    elif [ "$ZAP_STATUS" -ne 0 ]; then
                        echo "ZAP scan execution failed."
                        exit "$ZAP_STATUS"

                    else
                        echo "ZAP scan completed without warnings."
                    fi

                    test -s security/reports/day7-jenkins-zap-report.html
                    test -s security/reports/day7-jenkins-zap-report.json

                    echo "ZAP HTML and JSON reports generated successfully."
                '''
            }
        }
    }

    post {

        always {
            sh '''
                docker rm -f ${DAST_CONTAINER} || true
            '''

            archiveArtifacts(
                artifacts: 'app/npm-audit-report.json,security/reports/*',
                allowEmptyArchive: true
            )
        }

        success {
            echo 'NovaPay CI/CD Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the Jenkins Console Output.'
        }
    }
}

