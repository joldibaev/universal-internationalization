const fs = require("fs");
const fse = require("fs-extra");

const PROD_PATH = "./dist/prod/browser/";

function moveFolder(folderPath, locale) {
	let allFiles = fs.readdirSync(folderPath);
	allFiles.forEach((fileName) => {
		const path = folderPath + fileName;
		const splitPath = path.split("/");

		const folderName = Array.from(path.split("/")).pop();
		const newPath = [folderPath, locale + "/", folderName].join("");

		const isIndexHTML = splitPath.at(-1) === "index.html";
		const isDirectory = fs.lstatSync(path).isDirectory();

		if (isDirectory || isIndexHTML) {
			const isAlreadyMoved = splitPath.at(-1) === splitPath.at(-2);
			if (!isAlreadyMoved) {
				fse.move(path, newPath);
			}
		}
	});
}

function startMove() {
	console.log("Start moving prerendered pages");

	let allLocales = fs.readdirSync(PROD_PATH, "utf-8");
	for (const locale of allLocales) {
		if (locale !== "en") {
			const path = PROD_PATH + locale + "/";
			moveFolder(path, locale);
		}
	}
}

startMove();
