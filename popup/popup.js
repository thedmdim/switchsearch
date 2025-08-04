document.addEventListener("DOMContentLoaded", async () => {

    // theme
    let { theme } = await chrome.storage.local.get("theme");
    if (!theme || theme === "auto") {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("theme", theme);
    
    // search engines list
    let { TextSearchEngines } = await chrome.storage.local.get("TextSearchEngines")

    let [fieldset] = document.getElementsByTagName("fieldset");

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabUrl = new URL(tab.url);

    let currSearchEngine
    for (let i in TextSearchEngines) {
        let search = TextSearchEngines[i]
        let url = new URL(search.url)
        if (url.hostname == tabUrl.hostname) {
            currSearchEngine = search
            break
        }
    }

    for (let i in TextSearchEngines) {
        let search = TextSearchEngines[i]

        if (!search.enabled) {
            continue
        }

        const label = document.createElement("label");
        label.style.display = "block";

        const input = document.createElement("input");
        
        input.type = "radio"
        input.name = "search-engine"
        input.value = search.name

        if (currSearchEngine && currSearchEngine.name == input.value) {
            input.setAttribute('checked', 'checked');
        }
        
        label.appendChild(input)
        label.innerHTML += search.name
        fieldset.appendChild(label);
    }

    fieldset.addEventListener("change", async (event) => {
        if (event.target.name !== "search-engine") return;
    
        const nextSearchEngine = TextSearchEngines.find(e => e.name === event.target.value);
        const nextURL = new URL(nextSearchEngine.url);
    
        if (currSearchEngine) {
            const currq = tabUrl.searchParams.get(currSearchEngine.qparam);
            const { lastq } = await chrome.storage.local.get("lastq");
            const query = currq || lastq;
    
            if (tabUrl.pathname === "/" && !currq && !currSearchEngine.useLastq) {
                chrome.tabs.update(tab.id, { url: nextURL.origin });
            } else {
                nextURL.searchParams.set(nextSearchEngine.qparam, query);
                chrome.tabs.update(tab.id, { url: nextURL.href });
                chrome.storage.local.set({ lastq: query });
            }
        } else if (["chrome://new-tab-page/", "chrome://newtab/", "about:blank"].includes(tabUrl.href)) {    
            chrome.tabs.update(tab.id, { url: nextURL.origin });
        } else {
            chrome.tabs.create({ url: nextURL.origin });
        }
    });
});