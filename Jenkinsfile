pipeline {
    agent any
    environment {
        NODE_VERSION = '18.16.0'
        NETLIFY_SITE_ID = 'e961e065-4759-410e-b42d-7e15c36175ea'
        NETLIFY_AUTH_TOKEN = credentials('NETLIFY_AUTH_TOKEN')
    }
    
    stages {
        stage('Setup') {
            agent {
                docker {
                    image "node:${NODE_VERSION}-alpine"
                    args '-u root --network host -v /root/.npm:/root/.npm'
                    reuseNode true
                }
            }
            steps {
                checkout scm
                sh '''
                    set -e
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }
        
        stage('Test') {
            agent {
                docker {
                    image "node:${NODE_VERSION}-alpine"
                    args '-u root --network host'
                    reuseNode true
                }
            }
            steps {
                sh 'npm test -- --watchAll=false --coverage'
                junit '**/junit.xml'
            }
        }
        
        stage('Build') {
            agent {
                docker {
                    image "node:${NODE_VERSION}-alpine"
                    args '-u root --network host'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    set -e
                    npm run build
                '''
                archiveArtifacts artifacts: 'build/**/*'
            }
        }
        
        stage('Deploy to Netlify') {
            agent {
                docker {
                    image "node:${NODE_VERSION}-alpine"
                    args '-u root --network host'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    set -e
                    if ! command -v netlify &> /dev/null; then
                        npm install -g netlify-cli
                    fi
                    netlify deploy \
                        --prod \
                        --dir=build \
                        --auth=${NETLIFY_AUTH_TOKEN} \
                        --site=${NETLIFY_SITE_ID}
                '''
            }
        }
    }
    
    post {
    always {
        script {
            sh 'rm -rf * || true'
        }
    }
}
}
