MAKEFLAGS += --silent

.PHONY: help install start test test-api lint

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

start:
	node --use_strict src/index.js

install:
	npm install

test:
	npm test

.DEFAULT_GOAL := help
