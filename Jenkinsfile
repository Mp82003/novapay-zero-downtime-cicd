

pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    environment {
        DOCKER_NETWORK = 'novapay-network'
        API_IMAGE = 'novapay-api:day7'
        API_CONTAINER = 'novapay-dast-target'
        ZAP_IMAGE = 'ghcr.io/zaproxy/zaproxy:stable'
        API_PORT = '3000'
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
                    docker rm -f ${API_CONTAINER} 2>/dev/null || true

                    docker run -d \
                        --name ${API_CONTAINER} \
                        --network ${DOCKER_NETWORK} \
                        ${API_IMAGE}

                    sleep 5

                    docker exec ${API_CONTAINER} \
                        wget -qO- http://localhost:${API_PORT}/health
                '''
            }
        }

        stage('OWASP ZAP DAST Scan') {
            steps {
                sh '''
                    mkdir -p security/reports

                    chmod 777 security/reports

                    docker run --rm \
                        --network ${DOCKER_NETWORK} \
                        -v "$WORKSPACE/security/reports:/zap/wrk/:rw" \
                        ${ZAP_IMAGE} \
                        zap-baseline.py \
                        -t http://${API_CONTAINER}:${API_PORT}/health \
                        -r day7-jenkins-zap-report.html \
                        -J day7-jenkins-zap-report.json
                '''
            }
        }

    }

    post {
        always {
            sh '''
                docker rm -f ${API_CONTAINER} 2>/dev/null || true
            '''

            archiveArtifacts(
                artifacts: 'app/npm-audit-report.json,security/reports/*',
                allowEmptyArchive: true
            )
        }

        success {
            echo 'NovaPay CI/CD Pipeline with DAST completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Jenkins Console Output.'
        }
    }
}

