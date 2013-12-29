MIGRATION_FILES = $(shell find db/migrations -name "*.js")

all: public/application.css public/admin-application.css public/admin-application.js migrate seed

migrate: $(MIGRATION_FILES)
	./node_modules/.bin/knex migrate:latest -c db/config.js

seed:
	@./bin/seed-user.js

public/%.css: bower_components/bootstrap/less/bootstrap.less less/%.less
	./node_modules/.bin/lessc $(word 2,$^) > $@

public/admin-application.js: lib/admin/client/boot.js
	./node_modules/.bin/browserify lib/admin/client/boot.js > $@

bower_components/bootstrap/less/bootstrap.less:
	./node_modules/.bin/bower install

test:
	@NODE_ENV=test ./node_modules/.bin/knex migrate:latest -c db/config.js && \
	NODE_ENV=test ./node_modules/.bin/mocha \
		--require=./test/lib/unittest-sinon-chai.js \
		--harmony-generators \
		--reporter=dot \
		test/models/* \
		test/routes/* \
		test/views/*

.PHONY: migrate seed test
