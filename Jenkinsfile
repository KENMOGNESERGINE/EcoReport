pipeline {
    agent any
    environment {
        DOCKER_IMAGE    = 'kenmognesergine/ecoreport-backend'
        DOCKER_TAG      = "${BUILD_NUMBER}"
        DOCKER_CRED     = credentials('dockerhub-credentials')
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/KENMOGNESERGINE/EcoReport.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                dir('backend') { sh 'npm ci --legacy-peer-deps' }
            }
        }
        stage('Run Tests') {
            steps {
                dir('backend') { sh 'npm test -- --forceExit' }
            }
        }
        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                sh "echo ${DOCKER_CRED_PSW} | docker login -u ${DOCKER_CRED_USR} --password-stdin"
                sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker push ${DOCKER_IMAGE}:latest"
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                dir('k8s') {
                    sh 'kubectl apply -f 00-namespace.yaml'
                    sh 'kubectl apply -f 01-configmap.yaml'
                    sh 'kubectl apply -f 02-secrets.yaml'
                    sh 'kubectl apply -f 03-postgres-pvc.yaml'
                    sh 'kubectl apply -f 04-postgres-deployment.yaml'
                    sh 'kubectl apply -f 05-rabbitmq-deployment.yaml'
                    sh 'kubectl apply -f 06-backend-deployment.yaml'
                    sh 'kubectl apply -f 07-ingress.yaml'
                    sh 'kubectl apply -f 08-hpa.yaml'
                    sh "kubectl set image deployment/ecoreport-backend backend=${DOCKER_IMAGE}:${DOCKER_TAG} -n ecoreport"
                    sh 'kubectl rollout status deployment/ecoreport-backend -n ecoreport'
                }
            }
        }
        stage('Verify') {
            steps {
                sh 'kubectl get pods -n ecoreport'
                sh 'kubectl get services -n ecoreport'
            }
        }
    }
    post {
        success { echo "Pipeline succeeded!" }
        failure { echo "Pipeline failed." }
    }
}
