import { TextSearchEngines, ImageSearchEngines } from "./shared/search-engines.js";
  
browser.runtime.onInstalled.addListener(async () => {

    // keep records user has added before update
    let session = await browser.storage.local.get()
    let prevSavedTextSearchEngines = session["TextSearchEngines"]

    // TO DO: remove isArray check after few versions
    let prevEnabled = {}
    if (Array.isArray(prevSavedTextSearchEngines)) {
        for (i in prevSavedTextSearchEngines) {
            let prevSaved = prevSavedTextSearchEngines[i]
            prevEnabled[prevSaved.name] = prevSaved.enabled
        }
        for (i in TextSearchEngines) {
            let searchName = TextSearchEngines[i].name
            if (prevEnabled.hasOwn(searchName)) {
                TextSearchEngines[i].enabled = prevEnabled[searchName]
            }
        }
    }

    browser.storage.local.set({TextSearchEngines: TextSearchEngines});
    browser.storage.local.set({ImageSearchEngines: ImageSearchEngines});

    // create context menu for image search
    for (let i in ImageSearchEngines) {
        let name = ImageSearchEngines[i].name

        browser.contextMenus.create({
            id: `${name}.ImageSearch`,
            title: `Search image with ${name}`,
            contexts: ["image"]
        });
    }
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {

    let { ImageSearchEngines } = await browser.storage.local.get("ImageSearchEngines")
    if (!ImageSearchEngines) {
        return
    }

    let [searchName, searchType] = info.menuItemId.split(".")

    if (searchType === "ImageSearch") {
        let search = ImageSearchEngines.find(e => e.name == searchName)
        if (search) {
            let url = new URL(search.url)
            url.searchParams.set(search.qparam, info.srcUrl)
            browser.tabs.create({ url: url.href });
        }
    }

});
  