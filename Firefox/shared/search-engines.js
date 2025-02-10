// initialize text search engines
const TextSearchEngines = {
	Google: {
		url: "https://www.google.com/search",
		qparam: "q",
		builtIn: true,
		enabled: true
	},
	Yandex: {
		url: "https://ya.ru/search/",
		qparam: "text",
		builtIn: true,
		enabled: true
	},
	Brave: {
		url: "https://search.brave.com/search",
		qparam: "q",
		builtIn: true,
		enabled: true
	},
	Perplexity: {
		url: "https://www.perplexity.ai/search/new",
		qparam: "q",
		builtIn: true,
		enabled: true
	},
};

// initialize image search engines
const ImageSearchEngines = {
	Google: {
		url: "https://lens.google.com/uploadbyurl",
		qparam: "url"
	},
	Yandex: {
		url: "https://ya.ru/images/search?rpt=imageview",
		qparam: "url"
	}
};


export { TextSearchEngines, ImageSearchEngines }