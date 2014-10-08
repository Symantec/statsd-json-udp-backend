.PHONY: test
all: test check_style

test:
	mocha --reporter list

check_style:
	jscs ./lib --preset=google
