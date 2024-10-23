pipeline {
    agent { label 'ec2-devita-back' }
    environment {
        ECR_REGISTRY = '860195224276.dkr.ecr.ap-northeast-2.amazonaws.com'
        ECR_REPO_NAME = 'devita_ecr'
        IMAGE_TAG = 'latest'
        AWS_REGION = 'ap-northeast-2'
        AWS_CREDENTIALS = credentials('AwsCredentials')  // Jenkins credentials에서 한 번에 불러오기
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                        git branch: 'main', url: 'https://github.com/mynameisjinhohong/jenkinsTest', credentialsId: "githubAccessToken"
                }
            }
        }
        stage('Login to ECR') {
            steps {
                script {
                    // AWS 자격 증명을 환경 변수로 설정
                    sh '''
                    export AWS_ACCESS_KEY_ID=$(echo $AWS_CREDENTIALS | cut -d':' -f1)
                    export AWS_SECRET_ACCESS_KEY=$(echo $AWS_CREDENTIALS | cut -d':' -f2)
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
                    '''
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    sh '''
                    ls
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
                        success {
            script {
                // EC2 인스턴스 시작
                sh '''
                export AWS_ACCESS_KEY_ID=$(echo $AWS_CREDENTIALS | cut -d':' -f1)
                export AWS_SECRET_ACCESS_KEY=$(echo $AWS_CREDENTIALS | cut -d':' -f2)
                aws ec2 start-instances --instance-ids $INSTANCE_ID --region $AWS_REGION
                aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $AWS_REGION
                '''

                // 최신 이미지 가져와서 실행
                sh '''
                LATEST_IMAGE=$(aws ecr describe-images --repository-name $ECR_REPO_NAME --query 'sort_by(imageDetails,& imagePushedAt)[-1].imageTags[0]' --output text --region $AWS_REGION)
                docker pull $ECR_REGISTRY/$ECR_REPO_NAME:$LATEST_IMAGE

                # 이전 컨테이너 종료 및 삭제
                docker stop devita_back || true
                docker rm devita_back || true
                # 최신 이미지로 새 컨테이너 실행
                docker run -d --name devita_back $ECR_REGISTRY/$ECR_REPO_NAME:$LATEST_IMAGE
                '''

            }
        }
        always {
            cleanWs()
        }
    }
}
