document.addEventListener("DOMContentLoaded", async () => {
    let { TextSearchEngines } = await browser.storage.local.get("TextSearchEngines")

    let [fieldset] = document.getElementsByTagName("fieldset");

    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    const tabUrl = new URL(tab.url);

    let currSe
    for (let name in TextSearchEngines) {
        let search = TextSearchEngines[name]
        let url = new URL(search.url)
        if (url.hostname == tabUrl.hostname && (tabUrl.pathname == "/" || url.pathname == tabUrl.pathname)) {
            currSe = name
        }
    }

    for (let name in TextSearchEngines) {
        const label = document.createElement("label");
        label.style.display = "block";

        const input = document.createElement("input");
        
        input.type = "radio"
        input.name = "search-engine"
        input.value = name

        if (input.value == currSe) {
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

            if (currSe) {
                let currq = tabUrl.searchParams.get(TextSearchEngines[currSe].qparam)
                if (currq) {
                    url.searchParams.set(newSe.qparam, currq)
                    browser.tabs.update(tab.id, { url: url.href });
                } else {
                    browser.tabs.update(tab.id, { url: url.protocol + "//" + url.hostname });  
                }
            } else {
                browser.tabs.create( { url: url.protocol + "//" + url.hostname } )
            }
        }
    });
});