pipeline {
    agent { label 'ec2-agent' }  // EC2 인스턴스를 사용
    environment {
        ECR_REGISTRY = '860195224276.dkr.ecr.ap-northeast-2.amazonaws.com'  // Private ECR 레지스트리 주소
        ECR_REPO_NAME = 'devita_ecr'  // 생성한 레포지토리 이름
        IMAGE_TAG = 'latest'
        AWS_REGION = 'ap-northeast-2'  // ECR이 위치한 AWS 리전
    }
    stages {
        stage('Checkout') {
            steps {
                // GitHub 레포지토리에서 코드 클론
                git branch: 'main', url: 'https://github.com/mynameisjinhohong/jenkinsTest.git'
            }
        }
        stage('Add Jenkins to Docker Group') {
            steps {
                script {
                    // Jenkins 사용자를 Docker 그룹에 추가
                    sh '''
                    sudo usermod -aG docker jenkins
                    sudo systemctl restart docker
                    '''
                }
            }
        }
        stage('Install AWS CLI') {
            steps {
                script {
                    // AWS CLI 설치
                    sh '''
                    sudo apt-get update
                    sudo apt-get install -y awscli
                    '''
                }
            }
        }
        stage('Login to ECR') {
            steps {
                script {
                    // AWS CLI를 사용해 ECR에 로그인
                    sh '''
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
                    '''
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    // Docker 이미지 빌드 및 태그 추가
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
                    // ECR로 Docker 이미지 푸시
                    sh '''
                    docker push $ECR_REGISTRY/$ECR_REPO_NAME:$IMAGE_TAG
                    '''
                }
            }
        }
    }
    post {
        always {
            // 빌드 후 워크스페이스 정리
            cleanWs()
        }
    }
}
