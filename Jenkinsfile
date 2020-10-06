def label = "worker-${UUID.randomUUID().toString()}"

podTemplate(
    cloud: 'kubernetes',
    namespace: 'development',
    label: label,
    containers: [
        containerTemplate(name: 'docker', image: 'wsibimagerepo.azurecr.io/docker:stable-git', ttyEnabled: true, command: 'cat'),
        containerTemplate(name: 'kubectl', image: 'wsibimagerepo.azurecr.io/k8s-kubectl:v1.14.6', ttyEnabled: true, command: 'cat')

    ],
    volumes: [
        hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock'),
        hostPathVolume(hostPath: '/root/.m2/repository', mountPath: '/root/.m2/repository')
    ]
) {

    node(label) {
      def scmInfo = checkout scm
      sh "ls -alrt"
      def image_tag
      def image_name
      def messageInfo
      def mvnInfo
      sh 'pwd'
      def gitCommit = scmInfo.GIT_COMMIT
      def gitBranch = scmInfo.GIT_BRANCH
	    def commitId
	    commitId= scmInfo.GIT_COMMIT[0..7]
        image_tag = "${scmInfo.GIT_BRANCH}-${scmInfo.GIT_COMMIT[0..7]}"
        //image_tag = "develop-${scmInfo.GIT_COMMIT[0..7]}"
      stage('Initial') {
            // Only deploy if image_tag is a git tag (regex?)
            echo 'Build started!'
            image_name = "wsibimagerepo.azurecr.io/ui-nihl-claim"
                echo image_name
        }
        if (gitBranch =~ 'v\\d+\\.\\d+|v\\d+\\.\\d+\\.\\d+') {

        stage('Preparing Deployment scripts') {
            container('kubectl') {
                 echo 'preparation of deployment scripts!!!'
                // Inject image and tag values in deployment scripts
               withEnv(["IMAGE_NAME=${image_name}", "IMAGE_TAG=master-${scmInfo.GIT_COMMIT[0..7]}"]) {
                    def files = findFiles(glob: 'infrastructure/**/*.yaml')

                    for (def file : files) {
                      sh "sed -i 's,\${IMAGE_NAME},${IMAGE_NAME},g;s,\${IMAGE_TAG},${IMAGE_TAG},g' ${file.path}"
                    }
              }
            }
        }
        stage('Deploy') {
            container('kubectl') {
                 withCredentials([file(credentialsId: 'NIHL_KUBE_CONFIG', variable: 'KUBE_CONFIG')]) {
                    def kubectl
                    echo 'deploy to Production!'
                    kubectl = "kubectl --kubeconfig=${KUBE_CONFIG} --context=K8sCluster-CC-Prod-Cluster2"
                    sh "${kubectl} apply -f ./infrastructure/prod -n=nihl"

            }
           }
        }

         } else {
        stage('Build Docker Image') {
            container('docker') {
                echo 'docker'
                sh "docker build -t ${image_name} ."
                sh "docker tag ${image_name} ${image_name}:${image_tag}"
            }
        }

        stage('Push Docker Image') {
            container('docker') {
                echo 'push'
		    withDockerRegistry(credentialsId: 'acr_credentials', url: 'https://wsibimagerepo.azurecr.io') {
               		 sh "docker push ${image_name}:${image_tag}"
		       }
            }
        }
        stage('Preparing Deployment scripts') {
            container('kubectl') {
                 echo 'preparation of deployment scripts!'
                // Inject image and tag values in deployment scripts
               withEnv(["IMAGE_NAME=${image_name}", "IMAGE_TAG=${image_tag}"]) {
                    def files = findFiles(glob: 'infrastructure/**/*.yaml')

                    for (def file : files) {
                      sh "sed -i 's,\${IMAGE_NAME},${IMAGE_NAME},g;s,\${IMAGE_TAG},${IMAGE_TAG},g' ${file.path}"
                    }
              }
            }
        }
        stage('Deploy') {
            container('kubectl') {
                withCredentials([file(credentialsId: 'KUBE_CONFIG', variable: 'KUBE_CONFIG')]) {
                    def kubectl
                     echo 'deploy to deployment!'
                     kubectl = "kubectl --kubeconfig=${KUBE_CONFIG} --context=K8sCluster-CC-Dev1"
                     echo 'deploy to DEVELOPMENT!'
                     sh "${kubectl} apply -f ./infrastructure/dev -n=nihl"
               		   messageInfo = "${mvnInfo} is deployed to dev"

            }
           }
        }
      }

    }

}
