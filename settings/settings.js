// Load saved search engines
async function loadSearchEngines() {
    let { TextSearchEngines } = await browser.storage.local.get("TextSearchEngines") || {};
    searchEngineList.innerHTML = "";

    if (TextSearchEngines) {
        for (let name in TextSearchEngines) {
            const li = document.createElement("li");
            li.innerHTML = `${name} - ${TextSearchEngines[name].url} 
                <button data-name="${name}">Delete</button>`;
            searchEngineList.appendChild(li);
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    let [ table ] = document.getElementsByTagName("table");
    let { TextSearchEngines } = await browser.storage.local.get("TextSearchEngines");
    for (let k in TextSearchEngines) {
        let search = TextSearchEngines[k]
        let row = document.createElement("tr")

        let name = document.createElement("td");
        name.innerHTML = k
        row.appendChild(name)

        let enabled = document.createElement("td");
        let input = document.createElement("input")
        input.type = "checkbox"
        if (search.enabled) {
            input.setAttribute('checked', 'checked');
        }
        enabled.appendChild(input)
        row.appendChild(enabled)

        let url = document.createElement("td");
        url.innerHTML = search.url
        row.appendChild(url)

        let qparam = document.createElement("td");
        qparam.innerHTML = search.qparam
        row.appendChild(qparam)


        let remove = document.createElement("td");
        if (search.builtIn) {
            remove.innerHTML = "built in"
        } else {
            let btn = document.createElement("input")
            btn.type = "button"
            btn.value = "remove"
            remove.appendChild(btn)
        }
        row.appendChild(remove)
        
        table.appendChild(row)
    }

    let row = document.createElement("tr")

    let name = document.createElement("td");
    let nameInput = document.createElement("input");
    name.appendChild(nameInput)
    row.appendChild(name)

    let enabled = document.createElement("td");
    row.appendChild(enabled)


    let url = document.createElement("td");
    let urlInput = document.createElement("input");
    url.appendChild(urlInput)
    row.appendChild(url)


    let qparam = document.createElement("td");
    let qparamInput = document.createElement("input");
    qparam.appendChild(qparamInput)
    row.appendChild(qparam)

    let append = document.createElement("td");
    let appendInput = document.createElement("input");
    appendInput.type = "button"
    appendInput.value = "append"
    append.appendChild(appendInput)
    row.appendChild(append)
    table.appendChild(row)

});
