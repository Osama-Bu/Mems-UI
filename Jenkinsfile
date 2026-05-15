pipeline {
  agent {
      kubernetes {
          inheritFrom 'frontend-build'
      }
  }

  stages {
    stage('Project Compile') {
      steps {
        container('nodejs') {
          sh 'npm install --registry=http://registry.npm.taobao.org'
          sh 'npm run build:prod'
          sh 'ls'
        }

      }
    }

    stage('Build Docker Images') {
      steps {
        container('docker') {
          sh 'docker build -t mems-ui:v1 -f Dockerfile .'
        }

      }
    }

    stage('Push Docker Images') {
      steps {
        container('docker') {
          withCredentials([usernamePassword(credentialsId : 'docker-registry-credential' ,passwordVariable : 'DOCKER_PWD_TEXT' ,usernameVariable : 'DOCKER_USER_TEXT' ,)]) {
            sh 'echo "$DOCKER_PWD_TEXT" | docker login $REGISTRY -u "$DOCKER_USER_TEXT" --password-stdin'
            sh 'docker tag mems-ui:v1 $REGISTRY/$DOCKERHUB_NAMESPACE/mems-ui:SNAPSHOT-$BUILD_NUMBER'
            sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/mems-ui:SNAPSHOT-$BUILD_NUMBER'
          }

        }

      }
    }

    stage('K8s Deploy') {
      steps {

        kubernetesDeploy(configs: 'deploy/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
      }
    }

  }
  environment {
    DOCKER_CREDENTIAL_ID = 'docker-registry-credential'
    KUBECONFIG_CREDENTIAL_ID = 'jenkins-kubeconfig-credential'
    REGISTRY = '76.13.177.97:8085'
    DOCKERHUB_NAMESPACE = 'mems'
  }
  parameters {
    string(name: 'TAG_NAME', defaultValue: 'latest', description: 'Target image tag')
  }
}

