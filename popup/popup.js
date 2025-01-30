import searchEngines from "../shared/search-engines.js";


document.addEventListener("DOMContentLoaded", async () => {
    const [fieldset] = document.getElementsByTagName("fieldset");
    searchEngines.forEach((se) => {
        se.parsedURL = new URL(se.url)
        let params = Array.from(se.parsedURL.searchParams.keys())
        if (params.length == 1) {
            se.q = params[0]
        } else {
            console.error("more than 1 q param in searchEngines item")
        }

        const label = document.createElement("label");
        label.style.display = "block";

        const input = document.createElement("input");
        
        input.type = "radio"
        input.name = "search-engine"
        input.value = se.name

        
        label.appendChild(input)
        label.innerHTML += se.name
        fieldset.appendChild(label);
    });

    fieldset.addEventListener("change", async (event) => {
        if (event.target.name === "search-engine") {
            const [currTab] = await browser.tabs.query({ active: true, currentWindow: true });
            const currURL = new URL(currTab.url);
            const currSearch = searchEngines.find(se => se.parsedURL.hostname == currURL.hostname && (currURL.pathname == "/" || se.parsedURL.pathname == currURL.pathname))
            
            let newSearch = searchEngines.find(se => se.name == event.target.value)

            if (typeof currSearch === "undefined") {
                browser.tabs.create( { url: newSearch.parsedURL.protocol + newSearch.parsedURL.hostname } )
            } else {
                let currSeachQuery = currURL.searchParams.get(currSearch.q)
                if (currSeachQuery) {
                    newSearch.parsedURL.searchParams.set(newSearch.q, currSeachQuery)
                    browser.tabs.update(currTab.id, { url: newSearch.parsedURL.href });
                } else {
                    browser.tabs.update(currTab.id, { url: newSearch.parsedURL.protocol + newSearch.parsedURL.hostname });  
                }
            }
        }
    });
});

