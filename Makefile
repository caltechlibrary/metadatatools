#
# A Deno project makefile
#
PROJECT = metadatatools

PACKAGE =  $(shell ls -1 *.ts | grep -v 'version.ts')

PROGRAMS = mtd

TS_MODS = arxiv.ts arxiv_record.ts doi.ts doi_record.ts \
   isbn.ts isbn_record.ts isni.ts isni_record.ts \
   issn.ts issn_record.ts lcnaf.ts lcnaf_record.ts \
   orcid.ts orcid_record.ts pmcid.ts pmcid_record.ts \
   pmid.ts pmid_record.ts ror.ts ror_record.ts \
   snac.ts snac_record.ts utility.ts viaf.ts viaf_record.ts

GIT_GROUP = caltechlibrary

VERSION = $(shell grep '"version":' codemeta.json | cut -d\"  -f 4)

BRANCH = $(shell git branch | grep '* ' | cut -d\  -f 2)

PACKAGE = $(shell ls -1 *.ts | grep -v 'version.ts')

MAN_PAGES_1 = $(shell ls -1 *.1.md | sed -E 's/\.1.md/.1/g')

MAN_PAGES_3 = $(shell ls -1 *.3.md | sed -E 's/\.3.md/.3/g')

MAN_PAGES_7 = $(shell ls -1 *.7.md | sed -E 's/\.7.md/.7/g')

RELEASE_DATE=$(shell date +'%Y-%m-%d')

RELEASE_HASH=$(shell git log --pretty=format:'%h' -n 1)

HTML_PAGES = $(shell ls -1 *.html)

OS = $(shell uname)

EXT =
ifeq ($(OS), Windows)
        EXT = .exe
endif

#PREFIX = /usr/local/bin
PREFIX = $(HOME)

build: version.ts mdt.js $(TS_MODS) CITATION.cff about.md bin compile installer.sh installer.ps1 $(HTML_PAGES)

bin: .FORCE
	mkdir -p bin
	-if [ -d bin ]; then rm bin/*; fi

compile: check $(TS_MODS)
	deno task build
	./bin/mdt$(EXT) --help >mdt.1.md

check: $(TS_MODS)

test: .FORCE
	deno task test

bundle: mdt.js

mdt.js: *.ts
	deno task bundle
	git add mdt.js

version.ts: codemeta.json .FORCE
	cmt codemeta.json version.ts
	
format: $(TS_MODS)

$(TS_MODS): .FORCE
	deno check --allow-import $@
	deno fmt $@

man: $(MAN_PAGES_1) # $(MAN_PAGES_3) $(MAN_PAGES_7)

$(MAN_PAGES_1): .FORCE
	mkdir -p man/man1
	pandoc $@.md --from markdown --to man -s >man/man1/$@

CITATION.cff: codemeta.json .FORCE
	cmt codemeta.json CITATION.cff

about.md: codemeta.json .FORCE
	cmt codemeta.json about.md

status:
	git status

save:
	if [ "$(msg)" != "" ]; then git commit -am "$(msg)"; else git commit -am "Quick Save"; fi
	git push origin $(BRANCH)

website: $(HTML_PAGES) presentations .FORCE
	make -f website.mak

presentations: .FORCE
	cd presentations && make || exit 1

publish: website .FORCE
	./publish.bash

installer.sh: .FORCE
	cmt codemeta.json installer.sh
	chmod 775 installer.sh
	git add -f installer.sh

installer.ps1: .FORCE
	cmt codemeta.json installer.ps1
	chmod 775 installer.ps1
	git add -f installer.ps1

clean:
	if [ -d bin ]; then rm -fR bin/*; fi
	if [ -d dist ]; then rm -fR dist/*; fi

release: clean build website distribute_docs dist/Linux-x86_64 dist/Linux-aarch64 dist/macOS-x86_64 dist/macOS-arm64 dist/Windows-x86_64
	echo "Ready to do ./release.bash"

setup_dist: .FORCE
	@rm -fR dist
	@mkdir -p dist

distribute_docs: website setup_dist
	@cp README.md dist/
	@cp LICENSE dist/
	@cp codemeta.json dist/
	@cp CITATION.cff dist/
	@cp *.1.md dist/
	@cp INSTALL.md dist/
	@cp -vR man dist/

dist/Linux-x86_64: .FORCE
	@mkdir -p dist/bin
	deno task release_linux_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Linux-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/*
	@rm -fR dist/bin

dist/Linux-aarch64: .FORCE
	@mkdir -p dist/bin
	deno task release_linux_aarch64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Linux-aarch64.zip LICENSE codemeta.json CITATION.cff *.md bin/*
	@rm -fR dist/bin

dist/macOS-x86_64: .FORCE
	@mkdir -p dist/bin
	deno task release_macos_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-macOS-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/*
	@rm -fR dist/bin

dist/macOS-arm64: .FORCE
	@mkdir -p dist/bin
	deno task release_macos_aarch64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-macOS-arm64.zip LICENSE codemeta.json CITATION.cff *.md bin/*
	@rm -fR dist/bin

dist/Windows-x86_64: .FORCE
	@mkdir -p dist/bin
	deno task release_windows_x86_64
	@cd dist && zip -r $(PROJECT)-v$(VERSION)-Windows-x86_64.zip LICENSE codemeta.json CITATION.cff *.md bin/*
	@rm -fR dist/bin

.FORCE:
