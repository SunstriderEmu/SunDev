web/css/%.css: app/less/%.less
	lessc -M $< $@ > $*.d
	sed -e 's/^[^:]*: *//' < web/css/$*.d | \
		tr -s ' ' '\n' | \
		sed -e 's/$$/:/' \
		>> web/css/$*.d
	lessc $< > $@

-include main.d

all: web/css/main.css