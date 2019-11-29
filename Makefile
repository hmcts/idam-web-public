.DEFAULT_GOAL := all
CHART := idam-web-public
RELEASE := ${CHART}-pr-207
NAMESPACE := idam
TEST := ${RELEASE}
ACR := hmctspublic
ACR_SUBSCRIPTION := DCD-CNP-DEV
AKS_RESOURCE_GROUP := cnp-aks-rg
AKS_CLUSTER := cnp-aks-cluster

setup:
	az account set --subscription ${ACR_SUBSCRIPTION}
	az configure --defaults acr=${ACR}
	az acr helm repo add
	az aks get-credentials --resource-group ${AKS_RESOURCE_GROUP} --name ${AKS_CLUSTER}

clean:
	- helm delete --purge ${RELEASE} || echo "Release not found"
	- for i in $$(kubectl -n chart-tests get rs -o name | grep ${RELEASE}); do \
	   	kubectl -n chart-tests delete $${i} --grace-period=0 --force ; \
		done
	- for i in $$(kubectl -n ${NAMESPACE} get pod -o name | grep ${RELEASE}); do \
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

show-dep:
	kubectl -n ${NAMESPACE} describe $$(kubectl -n ${NAMESPACE} get deployments -o name | grep ${RELEASE})

show-pod:
	kubectl -n ${NAMESPACE} describe $$(kubectl -n ${NAMESPACE} get pods -o name | grep ${RELEASE})

events:
	kubectl -n ${NAMESPACE} describe $$(kubectl -n ${NAMESPACE} get pods -o name | grep ${RELEASE}) | grep -A 3 Events

redeploy: clean deploy

all: setup update clean lint deploy test

.PHONY: setup clean lint deploy test all
