LESS_FILES = $(shell find less -name "*.less")
CLIENT_JS_FILES = $(shell find lib/client lib/admin/client -name "*.js")

all: buildclient migrate

buildclient: public/application.css public/admin-application.css public/application.js public/admin-application.js 

migrate:
	./node_modules/.bin/knex migrate:latest -c db/config.js

seed:
	@./bin/seed-user.js

public/%.css: bower_components/bootstrap/less/bootstrap.less less/%.less $(LESS_FILES)
	./node_modules/.bin/lessc $(word 2,$^) > $@

public/application.js: $(CLIENT_JS_FILES)
	./node_modules/.bin/browserify lib/client/boot.js > $@

public/admin-application.js: $(CLIENT_JS_FILES)
	./node_modules/.bin/browserify lib/admin/client/boot.js > $@

bower_components/bootstrap/less/bootstrap.less bower_components/jquery/jquery.min.js:
	./node_modules/.bin/bower install

test: bower_components/jquery/jquery.min.js
	@NODE_ENV=test ./node_modules/.bin/knex migrate:latest -c db/config.js && \
	NODE_ENV=test ./node_modules/.bin/mocha \
		--require=./test/lib/unittest-sinon-chai.js \
		--harmony-generators \
		--reporter=dot \
		test/models/* \
		test/routes/* \
		test/views/* \
		test/admin/routes/*

.PHONY: seed test
