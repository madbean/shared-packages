# `dev-config`

## Usage

````
- install de gcloud: https://cloud.google.com/sdk/install?hl=fr
- login on cluster: gcloud container clusters get-credentials ******************** --zone ****************** --project ***********
- npm set registry https://******.****.com
- npm login with user mail: npm adduser --registry  https://******.****.com
- npm i -g @jchurque/k8s-load-config
- run in shell from your nodejs project:
- ``` loadConfig "secret/name,configmap/name" "config.env" "your_namespace" ```
````
