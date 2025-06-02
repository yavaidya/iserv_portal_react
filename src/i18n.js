// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
i18n.use(HttpBackend)
	.use(initReactI18next)
	.init({
		ns: ["login"],
		defaultNS: "login",
		fallbackLng: "en",
		debug: false,
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath: "/locales/{{lng}}/{{ns}}.json",
		},
	});

export default i18n;
