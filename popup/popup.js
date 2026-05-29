document.addEventListener("DOMContentLoaded", async () => {

    // theme
    let { theme } = await browser.storage.local.get("theme");
    if (!theme || theme === "auto") {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("theme", theme);
    
    // load open in new tab preference
    let { openInNewTab } = await browser.storage.local.get("openInNewTab");
    const checkbox = document.getElementById("open-in-new-tab");
    checkbox.checked = openInNewTab || false;
    
    // save checkbox state when changed
    checkbox.addEventListener("change", async () => {
        await browser.storage.local.set({ openInNewTab: checkbox.checked });
    });

    const allAtOnceCheckbox = document.getElementById("all-at-once");
    
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

    const getCurrentQuery = async () => {
        if (currSearchEngine) {
            const currq = tabUrl.searchParams.get(currSearchEngine.qparam);
            const { lastq } = await browser.storage.local.get("lastq");
            return currq || lastq;
        }

        const { lastq } = await browser.storage.local.get("lastq");
        return lastq;
    }

    allAtOnceCheckbox.addEventListener("change", async () => {
        if (!allAtOnceCheckbox.checked) return;

        const query = await getCurrentQuery();
        const enabledSearchEngines = TextSearchEngines.filter(search => search.enabled);

        for (const search of enabledSearchEngines) {
            if (currSearchEngine && search.name === currSearchEngine.name) {
                continue;
            }

            const url = new URL(search.url);
            if (query) {
                url.searchParams.set(search.qparam, query);
            }
            browser.tabs.create({ url: query ? url.href : url.origin });
        }

        if (query) {
            browser.storage.local.set({ lastq: query });
        }

        window.setTimeout(() => {
            allAtOnceCheckbox.checked = false;
        }, 1000);
    });

    fieldset.addEventListener("change", async (event) => {
        if (event.target.id === "all-at-once") return;
        if (event.target.name !== "search-engine") return;
    
        const nextSearchEngine = TextSearchEngines.find(e => e.name === event.target.value);
        const nextURL = new URL(nextSearchEngine.url);
        const { openInNewTab } = await browser.storage.local.get("openInNewTab");
        const shouldOpenInNewTab = openInNewTab || false;
    
        if (currSearchEngine) {
            const query = await getCurrentQuery();

            if (tabUrl.pathname === "/" && !tabUrl.searchParams.get(currSearchEngine.qparam) && !currSearchEngine.useLastq) {
                if (shouldOpenInNewTab) {
                    browser.tabs.create({ url: nextURL.origin });
                } else {
                    browser.tabs.update(tab.id, { url: nextURL.origin });
                }
            } else {
                nextURL.searchParams.set(nextSearchEngine.qparam, query);
                if (shouldOpenInNewTab) {
                    browser.tabs.create({ url: nextURL.href });
                } else {
                    browser.tabs.update(tab.id, { url: nextURL.href });
                }
                browser.storage.local.set({ lastq: query });
            }
        } else if (["about:newtab", "about:home", "about:blank"].includes(tabUrl.href)) {    
            if (shouldOpenInNewTab) {
                browser.tabs.create({ url: nextURL.origin });
            } else {
                browser.tabs.update(tab.id, { url: nextURL.origin });
            }
        } else {
            browser.tabs.create({ url: nextURL.origin });
        }
    });
});
