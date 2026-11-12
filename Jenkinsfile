
stage('SonarQube Analysis') {
    steps {
        script {
            def scannerHome = tool(name: 'SonarScanner',
                                   type: 'hudson.plugins.sonar.SonarRunnerInstallation')

            echo "SonarScanner installation: ${scannerHome}"

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

