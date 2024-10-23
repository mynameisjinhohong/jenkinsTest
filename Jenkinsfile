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
                    def branchName = env.GIT_BRANCH?.replaceFirst('origin/', '')  // 'origin/' 접두사 제거
                    echo "Detected branch: ${branchName}"
                    if (branchName == 'main') {
                        echo "PR merged into main branch. Proceeding with pipeline."
                        git branch: 'main', url: 'https://github.com/mynameisjinhohong/jenkinsTest', credentialsId: "githubAccessToken"
                    } else {
                        echo "This pipeline is only triggered for the main branch."
                        currentBuild.result = 'SUCCESS'
                        return
                    }
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
        always {
            cleanWs()
        }
    }
}
