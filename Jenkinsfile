pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                echo 'Code checked out from GitHub'
                sh 'ls -la'
            }
        }
        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install --legacy-peer-deps 2>&1 | tail -5'
                }
            }
        }
        stage('Run Tests') {
            steps {
                dir('backend') {
                    sh 'npm test -- --forceExit 2>&1 | tail -20'
                }
            }
        }
        stage('Health Check') {
            steps {
                sh 'curl http://localhost:3000/api/health'
                echo 'API is healthy!'
            }
        }
    }
    post {
        success { echo 'EcoReport pipeline succeeded!' }
        failure { echo 'Pipeline failed.' }
    }
}
