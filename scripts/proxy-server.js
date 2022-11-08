const express = require("express");
const path = require("path");

const app = (language) => {
	const distFolder = path.join(process.cwd(), "dist/prod/server", language);
	const server = require(`${distFolder}/main.js`);
	return server.app(language);
};

function run() {
	const port = process.env["PORT"] ?? 4000;

	const server = express();

	const allowedLanguages = [
		{code: "ru", urlPrefix: "/ru"},
		{code: "en", urlPrefix: "/"},
	];

	allowedLanguages.forEach((language) => {
		server.use(language.urlPrefix, app(language.code));
	});

	server.listen(port, () => {
		console.log(`Node Express server listening on http://localhost:${port} (PROD Proxy Server)`);
	});
}

run();
