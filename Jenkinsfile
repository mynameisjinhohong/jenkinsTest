pipeline {
    agent any

    environment {
        // Jenkins 크리덴셜 ID를 입력하세요. PAT 자체가 아닌 Jenkins 크리덴셜 ID여야 합니다.
        GIT_CREDENTIALS_ID = 'test_jinho'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKER_COMPOSE_PATH = '팀 미션_여행서비스/docker-compose.yml'
    }

    stages {
        stage('Clone Repository') {
            steps {
                // 레포지토리 클론
                git branch: 'main', url: 'https://github.com/mynameisjinhohong/jenkinsTest.git', credentialsId: GIT_CREDENTIALS_ID
            }
        }

        stage('Build and Deploy') {
            steps {
                dir('팀 미션_여행서비스') {
                    script {
                        // 도커 컴포즈를 사용하여 빌드 및 배포
                        sh 'docker-compose -f "$DOCKER_COMPOSE_PATH" up --build -d'
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
