pipeline {
    agent { label 'ec2-agent' }
    environment {
        ECR_REGISTRY = '860195224276.dkr.ecr.ap-northeast-2.amazonaws.com'
        ECR_REPO_NAME = 'devita_ecr'
        IMAGE_TAG = 'latest'
        AWS_REGION = 'ap-northeast-2'
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')  // Jenkins credentials에 저장된 Access Key
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')  // Jenkins credentials에 저장된 Secret Key
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mynameisjinhohong/jenkinsTest.git'
            }
        }
        stage('Add Jenkins to Docker Group') {
            steps {
                script {
                    // Jenkins 사용자를 Docker 그룹에 추가
                    sh '''
                    sudo usermod -aG docker ubuntu
                    sudo systemctl restart docker
                    '''
                }
            }
        }
        stage('Install AWS CLI') {
            steps {
                sh '''
                sudo apt-get update
                sudo apt-get install -y curl unzip
                curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                unzip awscliv2.zip
                sudo ./aws/install
                '''
            }
        }
        stage('Login to ECR') {
            steps {
                script {
                    // AWS 자격 증명을 환경 변수로 설정
                    sh '''
                    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
                    '''
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    sh '''
                    docker build -t $ECR_REPO_NAME:$IMAGE_TAG .
                    docker tag $ECR_REPO_NAME:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPO_NAME:$IMAGE_TAG
                    '''
                }
            }
        }
        stage('Push to ECR') {
            steps {
                script {
                    sh '''
                    docker push $ECR_REGISTRY/$ECR_REPO_NAME:$IMAGE_TAG
                    '''
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
