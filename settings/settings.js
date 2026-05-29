function createTableRow(searchData) {
    let row = document.createElement("tr")

    let col0 = document.createElement("td");
    col0.innerHTML = searchData.name
    row.appendChild(col0)

    let col1 = document.createElement("td");
    let input = document.createElement("input")
    input.name = "enabled"
    input.value = searchData.name
    input.type = "checkbox"
    if (searchData.enabled) {
        input.setAttribute('checked', 'checked');
    }
    col1.appendChild(input)
    row.appendChild(col1)

    let col2 = document.createElement("td");
    col2.innerHTML = searchData.url
    row.appendChild(col2)

    let col3 = document.createElement("td");
    col3.innerHTML = searchData.qparam
    row.appendChild(col3)


    let col4 = document.createElement("td");
    if (searchData.builtIn) {
        col4.innerHTML = "built in"
    } else {
        input = document.createElement("button")
        input.innerHTML = "remove"
        input.name = "remove"
        input.type = "button"
        input.value = searchData.name
        col4.appendChild(input)
    }
    row.appendChild(col4)
    return row
}

document.addEventListener("DOMContentLoaded", async () => {

    // theme settings

    let applyTheme = theme => {
        if (theme == "auto") {
            theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            document.documentElement.setAttribute("theme", theme);
            return
        }
        document.documentElement.setAttribute("theme", theme);
    }

    let { theme } = await browser.storage.local.get("theme");
    if (!theme) {
        theme = "auto"
    }
    applyTheme(theme)

    document.querySelectorAll("input[name='theme']").forEach(input => {
        if (input.value === theme) {
            input.checked = true
        }
        input.addEventListener("change", () => {
            browser.storage.local.set({ theme: input.value });
            applyTheme(input.value)
        });
    });

    // switch in new tab
    document.querySelector("input[name='newtab']").addEventListener("change", async event => {
        browser.storage.local.set({ newtab: event.target.checked });
    });

    // search engines list

    let appendForm = document.getElementById("append-form")
    let table = appendForm.parentNode
    let { TextSearchEngines } = await browser.storage.local.get("TextSearchEngines");
    for (let i in TextSearchEngines) {
        let row = createTableRow(TextSearchEngines[i])
        table.insertBefore(row, appendForm)
    }
    
    document.getElementById("append").onclick = async () => {
        let name = document.getElementById("name")
        let url = document.getElementById("url")
        let qparam = document.getElementById("qparam")

        if ( !name.value || !url.value || !qparam.value ) {
            alert("fill all the forms")
            return
        }

        let searchData = {
            name: name.value,
            url: url.value,
		    qparam: qparam.value,
		    builtIn: false,
		    enabled: true
        }
        let { TextSearchEngines } = await browser.storage.local.get("TextSearchEngines");
        TextSearchEngines.push(searchData)
        browser.storage.local.set({TextSearchEngines: TextSearchEngines});

        let row = createTableRow(searchData)
        table.insertBefore(row, appendForm)
    }

    table.addEventListener("click", async event => {
        if (event.target.name == "enabled") {
            let i = TextSearchEngines.findIndex(e => e.name == event.target.value)
            TextSearchEngines[i].enabled = event.target.checked
            browser.storage.local.set({TextSearchEngines: TextSearchEngines});
            return
        };

        if (event.target.name == "remove") {
            let { TextSearchEngines } = await browser.storage.local.get("TextSearchEngines");
            browser.storage.local.set({TextSearchEngines: TextSearchEngines.filter(e => e.name !== event.target.value)});
            browser.tabs.reload()
        }
    });
});
