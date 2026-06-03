// Inline search engines data (no ES module import - not supported in Yandex service workers)
const TextSearchEngines = [
    { name: "Google", url: "https://www.google.com/search", qparam: "q", builtIn: true, enabled: true, useLastq: false },
    { name: "Yandex", url: "https://ya.ru/search/", qparam: "text", builtIn: true, enabled: true, useLastq: false },
    { name: "Brave", url: "https://search.brave.com/search", qparam: "q", builtIn: true, enabled: true, useLastq: false },
    { name: "DuckDuckGo", url: "https://duckduckgo.com/", qparam: "q", builtIn: true, enabled: false, useLastq: false },
    { name: "Perplexity", url: "https://www.perplexity.ai/search/new", qparam: "q", builtIn: true, enabled: true, useLastq: true },
    { name: "ChatGPT", url: "https://chatgpt.com/?hints=search", qparam: "q", builtIn: true, enabled: false, useLastq: true },
    { name: "Wiby", url: "https://wiby.me/", qparam: "q", builtIn: true, enabled: false, useLastq: false },
    { name: "Marginalia", url: "https://marginalia-search.com/search", qparam: "query", builtIn: true, enabled: false, useLastq: false }
];

const ImageSearchEngines = [
    { name: "Google", url: "https://lens.google.com/uploadbyurl", qparam: "url" },
    { name: "Yandex", url: "https://ya.ru/images/search?rpt=imageview", qparam: "url" }
];

chrome.runtime.onInstalled.addListener(async () => {
    let session = await chrome.storage.local.get();
    let prevSavedTextSearchEngines = session["TextSearchEngines"];

    let prevEnabled = {};
    if (Array.isArray(prevSavedTextSearchEngines)) {
        for (let i in prevSavedTextSearchEngines) {
            let prevSaved = prevSavedTextSearchEngines[i];
            prevEnabled[prevSaved.name] = prevSaved.enabled;
        }
        for (let i in TextSearchEngines) {
            let searchName = TextSearchEngines[i].name;
            if (Object.hasOwn(prevEnabled, searchName)) {
                TextSearchEngines[i].enabled = prevEnabled[searchName];
            }
        }
    }

    chrome.storage.local.set({ TextSearchEngines: TextSearchEngines });
    chrome.storage.local.set({ ImageSearchEngines: ImageSearchEngines });

    for (let i in ImageSearchEngines) {
        let name = ImageSearchEngines[i].name;
        chrome.contextMenus.create({
            id: `${name}.ImageSearch`,
            title: `Search image with ${name}`,
            contexts: ["image"]
        });
    }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    let result = await chrome.storage.local.get("ImageSearchEngines");
    let engines = result.ImageSearchEngines;
    if (!engines) return;

    let [searchName, searchType] = info.menuItemId.split(".");
    if (searchType === "ImageSearch") {
        let search = engines.find(e => e.name == searchName);
        if (search) {
            let url = new URL(search.url);
            url.searchParams.set(search.qparam, info.srcUrl);
            chrome.tabs.create({ url: url.href });
        }
    }
});
