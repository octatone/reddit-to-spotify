GULP = ./node_modules/gulp/bin/gulp.js

watch:
	$(GULP) scripts watch

dev:
	$(GULP) scripts
	DEBUG=r2s:* nodemon --harmony lib/app/index.js