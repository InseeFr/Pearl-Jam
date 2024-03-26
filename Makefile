.PHONY: dev
dev:
	yarn run dev

.PHONY: proxy
proxy:
	caddy fmt --overwrite
	caddy run --watch
