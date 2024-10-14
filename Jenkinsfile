pipeline {
    agent { label 'ec2-agent' }  // EC2 인스턴스를 사용
    environment {
        ECR_REGISTRY = 'public.ecr.aws/y2t2b0y1'
        ECR_REPO_NAME = 'devita'
        IMAGE_TAG = 'latest'
    }
    stages {
        stage('Checkout') {
            steps {
                // GitHub 레포지토리에서 코드 클론
                git branch: 'main', url: 'https://github.com/mynameisjinhohong/jenkinsTest.git'
            }
        }
        stage('Build') {
            steps {
                script {
                    // Docker 이미지 빌드
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
                    
                    // ECR로 도커 이미지 푸시
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
