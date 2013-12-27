MIGRATION_FILES = $(shell find db/migrations -name "*.js")

all: public/application.css public/admin-application.css migrate seed

migrate: $(MIGRATION_FILES)
	./node_modules/.bin/knex migrate:latest -c db/config.js

seed:
	@./bin/seed-user.js

public/%.css: bootstrap less/%.less
	./node_modules/.bin/lessc $(word 2,$^) > $@

bootstrap:
	./node_modules/.bin/bower install

.PHONY: migrate seed
