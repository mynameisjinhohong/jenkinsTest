pipeline {
    agent any

    environment {
        GIT_CREDENTIALS_ID = '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'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKER_COMPOSE_PATH = '팀 미션_여행서비스/docker-compose.yml'
    }
 
    stages {
        stage('Clone Repository') {
            steps {
                // 레포지토리 클론
                git branch: 'main', url: 'https://github.com/mynameisjinhohong/KaKaoBootCamp.git', credentialsId: env.GIT_CREDENTIALS_ID
            }
        }
//왜 안된
        stage('Build and Deploy') {
            steps {
                dir('팀 미션_여행서비스') {
                    script {
                        // 도커 컴포즈를 사용하여 빌드 및 배포
                        sh 'docker-compose -f $DOCKER_COMPOSE_PATH up --build -d'
                    }
                }
            }
        }
    }


    

    post {
        always {
            // 도커 컨테이너 로그를 출력
            sh 'docker-compose -f $DOCKER_COMPOSE_PATH logs'
        }
        cleanup {
            // 청소 단계에서 도커 컴포즈 정리
            sh 'docker-compose -f $DOCKER_COMPOSE_PATH down'
        }
    }
}
