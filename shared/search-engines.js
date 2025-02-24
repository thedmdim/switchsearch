// initialize text search engines
const TextSearchEngines = [
	{
		name: "Google",
		url: "https://www.google.com/search",
		qparam: "q",
		builtIn: true,
		enabled: true
	},
	{
		name: "Yandex",
		url: "https://ya.ru/search/",
		qparam: "text",
		builtIn: true,
		enabled: true
	},
	{
		name: "Brave",
		url: "https://search.brave.com/search",
		qparam: "q",
		builtIn: true,
		enabled: true
	},
	{
		name: "Perplexity",
		url: "https://www.perplexity.ai/search/new",
		qparam: "q",
		builtIn: true,
		enabled: true
	},
	{
		name: "ChatGPT(Search)",
		url: "https://chatgpt.com/?hints=search",
		qparam: "q",
		builtIn: true,
		enabled: true
	},
	{
		name: "DuckDuckGo",
		url: "https://duckduckgo.com/",
		qparam: "q",
		builtIn: true,
		enabled: true
	},
	{
		name: "Wiby",
		url: "http://wiby.me/",
		qparam: "q",
		builtIn: true,
		enabled: false
	}
];

// initialize image search engines
const ImageSearchEngines = [
	{
		name: "Google",
		url: "https://lens.google.com/uploadbyurl",
		qparam: "url"
	},
	{
		name: "Yandex",
		url: "https://ya.ru/images/search?rpt=imageview",
		qparam: "url"
	}
];


export { TextSearchEngines, ImageSearchEngines }
