import searchEngines from "../shared/search-engines.js";


document.addEventListener("DOMContentLoaded", async () => {
    let [fieldset] = document.getElementsByTagName("fieldset");

    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab.url);
    const currSe = searchEngines.find(se => se.url.hostname == url.hostname && (url.pathname == "/" || se.url.pathname == url.pathname));

    searchEngines.forEach(se => {

        const label = document.createElement("label");
        label.style.display = "block";

        const input = document.createElement("input");
        
        input.type = "radio"
        input.name = "search-engine"
        input.value = se.name

        if (currSe && input.value == currSe.name) {
            input.setAttribute('checked', 'checked');
        }
        
        label.appendChild(input)
        label.innerHTML += se.name
        fieldset.appendChild(label);
    });

    fieldset.addEventListener("change", async (event) => {
        if (event.target.name === "search-engine") {
            let newSe = searchEngines.find(se => se.name == event.target.value)

            if (currSe) {
                let currq = url.searchParams.get(currSe.q)
                if (currq) {
                    newSe.url.searchParams.set(newSe.q, currq)
                    browser.tabs.update(tab.id, { url: newSe.url.href });
                } else {
                    browser.tabs.update(tab.id, { url: newSe.url.protocol + "//" + newSe.url.hostname });  
                }
            } else {
                browser.tabs.create( { url: newSe.url.protocol + "//" + newSe.url.hostname } )
            }
        }
    });
});