deps:
	yarn install

dev:
	node node_modules/webpack/bin/webpack.js --watch

pack:
	node node_modules/webpack/bin/webpack.js

.ONESHELL: