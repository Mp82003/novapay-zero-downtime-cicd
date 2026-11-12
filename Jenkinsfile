
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    stages {

        // Stage 1: Checkout source code
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Mp82003/novapay-zero-downtime-cicd.git'
            }
        }

        // Stage 2: Install application dependencies
        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh 'npm ci'
                }
            }
        }

        // Stage 3: Dependency vulnerability scanning
        stage('Dependency Security Scan') {
            steps {
                dir('app') {
                    echo 'Generating dependency vulnerability report...'

                    sh '''
                        npm audit --json > npm-audit-report.json || true
                    '''

                    echo 'Enforcing dependency security policy...'

                    sh 'npm audit --audit-level=high'
                }
            }
        }

        // Stage 4: Run automated application tests
        stage('Run Tests') {
            steps {
                dir('app') {
                    sh 'npm test'
                }
            }
        }

        // Stage 5: SonarQube code analysis
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
    }

    // Archive security report even if a stage fails
    post {
        always {
            archiveArtifacts(
                artifacts: 'app/npm-audit-report.json',
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


