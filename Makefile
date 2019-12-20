.DEFAULT_GOAL := all
CHART := idam-web-public
RELEASE := ${CHART}-pr-${PR}
NAMESPACE := idam
TEST := ${RELEASE}-test-service
ACR := hmctspublic
ACR_SUBSCRIPTION := DCD-CNP-Dev
AKS_RESOURCE_GROUP := cnp-aks-rg
AKS_CLUSTER := cnp-aks-cluster

HELM_INSTALLED := $(command -v helm)
UNAME := $(uname)

# Usage example: make <command> PR='123'

setup:
	- @if [ -z "${HELM_INSTALLED}" ] && [[ "${UNAME}" == 'Darwin' ]]; then \
			brew install kubernetes-helm ; \
		fi
	az account set --subscription ${ACR_SUBSCRIPTION}
	az configure --defaults acr=${ACR}
	az acr helm repo add
	az aks get-credentials --resource-group ${AKS_RESOURCE_GROUP} --name ${AKS_CLUSTER}
	-	@if [ ! -d $${HOME}/.helm ]; then \
			helm init --client-only ; \
		fi

clean:
	- @helm delete --purge ${RELEASE}
	- @for i in $$(kubectl -n ${NAMESPACE} get rs -o name | grep ${RELEASE}); do \
	   	kubectl -n ${NAMESPACE} delete $${i} --grace-period=0 --force ; \
		done
	- @for i in $$(kubectl -n ${NAMESPACE} get pod -o name | grep ${RELEASE}); do \
	   	kubectl -n ${NAMESPACE} delete $${i} --grace-period=0 --force ; \
		done

update:
	helm dependency update charts/${CHART}

lint:
	helm lint charts/${CHART}

template:
	helm template charts/${CHART}

dry-run:
	helm install charts/${CHART} --name ${RELEASE} --namespace ${NAMESPACE} -f ci-values.yaml --dry-run --timeout 30 --atomic

deploy:
	helm install charts/${CHART} --name ${RELEASE} --namespace ${NAMESPACE} --wait --timeout 30

test:
	helm test charts/${RELEASE}

force-update-pods:
	@kubectl -n ${NAMESPACE} scale  --current-replicas=2 --replicas=0 deploy/idam-api
	@kubectl -n ${NAMESPACE} patch deploy idam-api -p '{"spec":{"template":{"spec":{"containers":[{"name":"idam-api", "imagePullPolicy": "Always"}]}}}}'
	@kubectl -n ${NAMESPACE} scale  --current-replicas=0 --replicas=2 deploy/idam-api
	@kubectl -n ${NAMESPACE} scale  --current-replicas=2 --replicas=0 deploy/idam-web-public
	@kubectl -n ${NAMESPACE} patch deploy idam-web-public -p '{"spec":{"template":{"spec":{"containers":[{"name":"idam-web-public", "imagePullPolicy": "Always"}]}}}}'
	@kubectl -n ${NAMESPACE} scale  --current-replicas=0 --replicas=2 deploy/idam-web-public
	@kubectl -n ${NAMESPACE} scale  --current-replicas=1 --replicas=0 deploy/idam-web-admin
	@kubectl -n ${NAMESPACE} patch deploy idam-web-admin -p '{"spec":{"template":{"spec":{"containers":[{"name":"idam-web-admin", "imagePullPolicy": "Always"}]}}}}'
	@kubectl -n ${NAMESPACE} scale  --current-replicas=0 --replicas=1 deploy/idam-web-admin
	@echo Done

logs:
	@echo "Use the spacebar to page and 'q' to exit."
	@sleep 2
	@kubectl -n ${NAMESPACE} logs $$(kubectl -n ${NAMESPACE} get deployments -o name | grep ${RELEASE} | awk NR==1) | more

# make port-forward PR='257'
port-forward:
	@echo -e "Killing kubectl pids on 8080.\nStarting port-forward.\nCtrl-C to exit."
	@kill $$(lsof -i tcp:8080 | grep kubectl | awk '{print $$2}') 2>&1 || echo 'No processes to kill.'
	@sleep 1
	@kubectl -n ${NAMESPACE} port-forward deployment/${RELEASE} 8080:8080 &
	@open 'http://localhost:8080/login?client_id=test-public-service&redirect_uri=https://test-public-service.com'

deployment:
	@kubectl -n ${NAMESPACE} describe $$(kubectl -n ${NAMESPACE} get deployments -o name | grep ${RELEASE})

pods:
	@kubectl -n ${NAMESPACE} describe $$(kubectl -n ${NAMESPACE} get pods -o name | grep ${RELEASE})

events:
	@kubectl -n ${NAMESPACE} describe $$(kubectl -n ${NAMESPACE} get pods -o name | grep ${RELEASE}) | grep -A 3 Events

redeploy: clean deploy

all: setup update clean lint deploy test

.PHONY: setup clean lint deploy test all