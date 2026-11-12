
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
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
                sh 'docker build -t novapay-api:day7 ./app'
            }
        }

        stage('Start DAST Target') {
            steps {
                sh '''
                    docker rm -f novapay-dast-target || true

                    docker run -d \
                        --name novapay-dast-target \
                        --network novapay-network \
                        novapay-api:day7

                    sleep 5

                    docker exec novapay-dast-target \
                        wget -qO- http://localhost:3000/health
                '''
            }
        }

        stage('OWASP ZAP DAST Scan') {
            steps {
                sh '''
                    mkdir -p security/reports
                    chmod 777 security/reports

                    docker run --rm \
                        --user 0:0 \
                        --network novapay-network \
                        -v "$WORKSPACE/security/reports:/zap/wrk/:rw" \
                        ghcr.io/zaproxy/zaproxy:stable \
                        zap-baseline.py \
                        -t http://novapay-dast-target:3000/health \
                        -r day7-jenkins-zap-report.html \
                        -J day7-jenkins-zap-report.json
                '''
            }
        }
    }

    post {
        always {
            sh '''
                docker rm -f novapay-dast-target || true
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

