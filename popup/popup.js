document.addEventListener("DOMContentLoaded", async () => {
    
    let { TextSearchEngines } = await browser.storage.local.get("TextSearchEngines")

    let [fieldset] = document.getElementsByTagName("fieldset");

    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    const tabUrl = new URL(tab.url);

    // let [searchName, searchData] = findSearchEngnieByUrl(tabUrl.hostname)
    let searchName, searchData
    for (let name in TextSearchEngines) {
        let search = TextSearchEngines[name]
        let url = new URL(search.url)
        if (url.hostname == tabUrl.hostname) {
            searchName = name
            searchData = search
            break
        }
    }

    for (let name in TextSearchEngines) {
        const label = document.createElement("label");
        label.style.display = "block";

        const input = document.createElement("input");
        
        input.type = "radio"
        input.name = "search-engine"
        input.value = name

        if (input.value == searchName) {
            input.setAttribute('checked', 'checked');
        }
        
        label.appendChild(input)
        label.innerHTML += name
        fieldset.appendChild(label);
    }

    fieldset.addEventListener("change", async (event) => {
        if (event.target.name === "search-engine") {
            let newSe = TextSearchEngines[event.target.value]
            let url = new URL(newSe.url)

            if (searchName) {
                let currq = tabUrl.searchParams.get(searchData.qparam)        
                if (!currq && tabUrl.pathname == "/") {
                    browser.tabs.update(tab.id, { url: url.protocol + "//" + url.hostname });  
                    return
                }

                let { lastq } = await browser.storage.local.get("lastq")
                let q = currq || lastq
                if (q) {
                    url.searchParams.set(newSe.qparam, q)
                    browser.tabs.update(tab.id, { url: url.href });
                    browser.storage.local.set({ lastq: q })
                    return
                }
            } else {
                browser.tabs.create( { url: url.protocol + "//" + url.hostname } )
            }
        }
    });
});