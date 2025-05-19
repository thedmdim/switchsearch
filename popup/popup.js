document.addEventListener("DOMContentLoaded", async () => {

    // theme
    let { theme } = await browser.storage.local.get("theme");
    if (!theme || theme === "auto") {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("theme", theme);
    
    // search engines list
    let { TextSearchEngines } = await browser.storage.local.get("TextSearchEngines")

    let [fieldset] = document.getElementsByTagName("fieldset");

    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
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
        if (event.target.name === "search-engine") {
            let nextSearchEngine = TextSearchEngines.find(e => e.name == event.target.value)
            let nextURL = new URL(nextSearchEngine.url)

            if (currSearchEngine) {

                let { lastq } = await browser.storage.local.get("lastq")
                let currq = tabUrl.searchParams.get(currSearchEngine.qparam)

                if (tabUrl.pathname == "/" && !currq && !currSearchEngine.useLastq) {
                    browser.tabs.update(tab.id, { url: nextURL.origin });
                    return
                }

                let q = currq || lastq
                nextURL.searchParams.set(nextSearchEngine.qparam, q)
                browser.tabs.update(tab.id, { url: nextURL.href });
                browser.storage.local.set({ lastq: q })
                return
                       
            } else {
                browser.tabs.create( { url: nextURL.origin } )
            }
        }
    });
});