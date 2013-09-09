TESTS = test/*.js
REPORTER = list

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require ./test/bootstrap \
		--reporter $(REPORTER) \
		--timeout 500000 \
		$(TESTS)

test-cov: lib-cov
	@enhanced_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov: clean
	@jscoverage lib lib-cov

clean:
	@rm -rf lib-cov
	@rm -f coverage.html

.PHONY: test lib-cov test-cov clean
