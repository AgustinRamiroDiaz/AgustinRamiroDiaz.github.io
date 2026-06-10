PDF_TOOL_DIR := devtools/pdf
PDF_URL ?= https://agustinramirodiaz.github.io/
PDF_OUTPUT ?= $(HOME)/Documents/agustin_ramiro_diaz.pdf

.PHONY: pdf pdf-local pdf-install

pdf:
	cd $(PDF_TOOL_DIR) && pnpm pdf "$(PDF_URL)" "$(PDF_OUTPUT)"

pdf-local:
	$(MAKE) pdf PDF_URL=http://127.0.0.1:1111/

pdf-install:
	cd $(PDF_TOOL_DIR) && pnpm install
