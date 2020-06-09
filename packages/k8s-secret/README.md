# `dev-config`

## Usage

```
- install de gcloud: https://cloud.google.com/sdk/install?hl=fr
- login on cluster: gcloud container clusters get-credentials ******************** --zone europe-west1-b --project ***********
- npm set registry https://******.****.com
- npm login with user mail => npm adduser --registry  https://******.****.com
- npm i -g @fnb/k8s-secret
- run in shell from your nodejs project:
- ``` loadConfig ```
- ``` loadConfig "secret/name,configmap/name" ```
- ``` loadConfig "secret/name,configmap/name" "config.env" ```
- ``` loadConfig false "config.env" ```
```
