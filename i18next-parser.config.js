// i18next-parser.config.js
module.exports = {
	locales: ["en"],
	defaultNamespace: "translation",
	output: "public/locales/$LOCALE/$NAMESPACE.json", // or src/locales if you prefer
	input: ["src/**/*.{js,jsx,ts,tsx}"],
	keySeparator: false, // Allow keys like "Page.Title" instead of nested objects
	namespaceSeparator: false,
	useKeysAsDefaultValue: true, // Save the original string as the value
	createOldCatalogs: false, // Don't keep old keys
	sort: true,
	verbose: true,
};
