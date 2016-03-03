ISTANBUL = ./node_modules/.bin/istanbul
ESLINT = ./node_modules/.bin/eslint
MOCHA = ./node_modules/.bin/_mocha
TESTS = $(shell find test/$(target) -name "*.js")

all: lint test coverage

# Tests
test:
	@$(ISTANBUL) cover --report lcov --report text --report html $(MOCHA) -- $(TESTS)

# Check code style
lint:
	@$(ESLINT) 'lib/**/*.js' 'test/**/*.js'

# Check coverage levels
coverage:
	@$(ISTANBUL) check-coverage --statement 85 --branch 70 --function 85

# Clean up
clean: clean-cov

clean-cov:
	@rm -rf coverage

.PHONY: all test lint coverage clean clean-cov

