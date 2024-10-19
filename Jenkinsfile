pipeline {
    agent { label 'ec2-agent' }
    environment {
        ECR_REGISTRY = '860195224276.dkr.ecr.ap-northeast-2.amazonaws.com'
        ECR_REPO_NAME = 'devita_ecr'
        IMAGE_TAG = 'latest'
        AWS_REGION = 'ap-northeast-2'
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
                    // Jenkins 사용자를 Docker 그룹에 추가하고, 디버그 정보 출력
                    sh '''
                    echo "현재 Jenkins 실행 사용자:"
                    whoami

                    echo "Jenkins 사용자가 docker 그룹에 속해 있는지 확인:"
                    id $(whoami)

                    echo "Jenkins 사용자를 docker 그룹에 추가 중..."
                    sudo usermod -aG docker $(whoami)
                    
                    echo "Docker 그룹에 사용자가 추가된 후 정보:"
                    id $(whoami)
                    
                    sudo chmod 666 /var/run/docker.sock

                    echo "Docker 서비스 재시작 중..."
                    sudo systemctl restart docker

                    echo "Docker 상태 확인:"
                    sudo systemctl status docker | head -n 10
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
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AwsCredentials', keyIdVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    sh '''
                    echo "Logging into ECR..."
                    echo $AWS_ACCESS_KEY_ID
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
