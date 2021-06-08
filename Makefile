SHELL := /bin/bash

test:
	TESTBUILD=true npx webpack --config webpack.config.js
	npx karma start karma.conf.js

clean:
	rm -fr test-dist/

publish:
	npm publish --access public

