document.addEventListener("DOMContentLoaded", async () => {
    
    let { TextSearchEngines } = await chrome.storage.local.get("TextSearchEngines")

    let [fieldset] = document.getElementsByTagName("fieldset");

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabUrl = new URL(tab.url);

    let currSearch
    for (let i in TextSearchEngines) {
        let search = TextSearchEngines[i]
        let url = new URL(search.url)
        if (url.hostname == tabUrl.hostname) {
            currSearch = search
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

        if (currSearch && currSearch.name == input.value) {
            input.setAttribute('checked', 'checked');
        }
        
        label.appendChild(input)
        label.innerHTML += search.name
        fieldset.appendChild(label);
    }

    fieldset.addEventListener("change", async (event) => {
        if (event.target.name === "search-engine") {
            let newSe = TextSearchEngines.find(e => e.name == event.target.value)
            let url = new URL(newSe.url)

            if (currSearch) {
                let currq = tabUrl.searchParams.get(currSearch.qparam)        
                if (!currq && tabUrl.pathname == "/") {
                    chrome.tabs.update(tab.id, { url: url.protocol + "//" + url.hostname });  
                    return
                }

                let { lastq } = await chrome.storage.local.get("lastq")
                let q = currq || lastq
                if (q) {
                    url.searchParams.set(newSe.qparam, q)
                    chrome.tabs.update(tab.id, { url: url.href });
                    chrome.storage.local.set({ lastq: q })
                    return
                }
            } else {
                chrome.tabs.create( { url: url.protocol + "//" + url.hostname } )
            }
        }
    });
});