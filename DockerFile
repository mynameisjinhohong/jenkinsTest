# Node.js 이미지를 베이스로 사용
FROM node:14

# 작업 디렉토리를 DevitaTest로 설정
WORKDIR /app

# package.json과 package-lock.json을 DevitaTest 폴더에서 복사
COPY DevitaTest/package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드를 DevitaTest 폴더에서 복사
COPY DevitaTest/ ./

# 웹 서버 실행 포트
EXPOSE 3000
# 애플리케이션 실행 명령어
CMD ["node", "index.js"]
