pipeline {
    agent any

    environment {
        GIT_CREDENTIALS_ID = 'test_jinho'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKER_COMPOSE_PATH = 'test/docker-compose.yml'
    }

    stages {
        stage('Clone Repository') {
            steps {
                // 레포지토리 클론
                git branch: 'main', url: 'https://github.com/mynameisjinhohong/jenkinsTest.git', credentialsId: GIT_CREDENTIALS_ID
            }
        }

        stage('Check File') {
            steps {
                script {
                    // 경로에 파일이 있는지 확인
                    sh 'ls -la test/docker-compose.yml'
                }
            }
        }

        stage('Build and Deploy') {
            steps {
                dir('test') {
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
