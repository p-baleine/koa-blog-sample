MIGRATION_FILES = $(shell find db/migrations -name "*.js")

migrate: $(MIGRATION_FILES)
	./node_modules/.bin/knex migrate:latest -c db/config.js

seed:
	@./bin/seed-user.js

.PHONY: migrate seed
