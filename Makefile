MIGRATION_FILES = $(shell find db/migrations -name "*.js")

all: public/application.css public/admin-application.css migrate seed

migrate: $(MIGRATION_FILES)
	./node_modules/.bin/knex migrate:latest -c db/config.js

seed:
	@./bin/seed-user.js

public/%.css: bower_components/bootstrap/less/bootstrap.less less/%.less
	./node_modules/.bin/lessc $(word 2,$^) > $@

bower_components/bootstrap/less/bootstrap.less:
	./node_modules/.bin/bower install

test:
	@NODE_ENV=test ./node_modules/.bin/knex migrate:latest -c db/config.js && \
	NODE_ENV=test ./node_modules/.bin/mocha

.PHONY: migrate seed test
