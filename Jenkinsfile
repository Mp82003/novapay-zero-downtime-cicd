pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'git@github.com:Mp82003/novapay-zero-downtime-cicd.git'
            }
        }
    }
}
