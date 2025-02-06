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

        let col0 = document.createElement("td");
        col0.innerHTML = k
        row.appendChild(col0)

        let col1 = document.createElement("td");
        let input = document.createElement("input")
        input.type = "checkbox"
        if (search.enabled) {
            input.setAttribute('checked', 'checked');
        }
        col1.appendChild(input)
        row.appendChild(col1)

        let col2 = document.createElement("td");
        col2.innerHTML = search.url
        row.appendChild(col2)

        let col3 = document.createElement("td");
        col3.innerHTML = search.qparam
        row.appendChild(col3)


        let col4 = document.createElement("td");
        if (search.builtIn) {
            col4.innerHTML = "built in"
        } else {
            input = document.createElement("input")
            input.type = "button"
            input.value = "remove"
            col4.appendChild(input)
        }
        row.appendChild(col4)
        
        table.appendChild(row)
    }

    let row = document.createElement("tr")

    let col0 = document.createElement("td");
    let input = document.createElement("input");
    input.placeholder = "name your search"
    col0.appendChild(input)
    row.appendChild(col0)

    let col1 = document.createElement("td");
    row.appendChild(col1)


    let col2 = document.createElement("td");
    input = document.createElement("input");
    input.placeholder = "place an url"
    col2.appendChild(input)
    row.appendChild(col2)


    let col3 = document.createElement("td");
    input = document.createElement("input");
    input.placeholder = "search query param"
    col3.appendChild(input)
    row.appendChild(col3)

    let col4 = document.createElement("td");
    input = document.createElement("input");
    input.type = "button"
    input.value = "append"
    col4.appendChild(input)
    row.appendChild(col4)

    table.appendChild(row)
});
