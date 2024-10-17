https://minikube.sigs.k8s.io/docs/start/

install

curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64
sudo install minikube-darwin-amd64 /usr/local/bin/minikube


minikube config set driver docker
minikube start --driver=docker

