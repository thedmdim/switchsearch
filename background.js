import { TextSearchEngines, ImageSearchEngines } from "./shared/search-engines.js";
  
chrome.runtime.onInstalled.addListener(async () => {

    // keep records user has added before update
    let session = await chrome.storage.local.get()
    let prevSavedTextSearchEngines = session["TextSearchEngines"]

    // TO DO: remove isArray check after few versions
    let prevEnabled = {}
    if (Array.isArray(prevSavedTextSearchEngines)) {
        for (let i in prevSavedTextSearchEngines) {
            let prevSaved = prevSavedTextSearchEngines[i]
            prevEnabled[prevSaved.name] = prevSaved.enabled
        }
        for (let i in TextSearchEngines) {
            let searchName = TextSearchEngines[i].name
            if (Object.hasOwn(prevEnabled, searchName)) {
                TextSearchEngines[i].enabled = prevEnabled[searchName]
            }
        }
    }

    chrome.storage.local.set({TextSearchEngines: TextSearchEngines});
    chrome.storage.local.set({ImageSearchEngines: ImageSearchEngines});

    // create context menu for image search
    for (let i in ImageSearchEngines) {
        let name = ImageSearchEngines[i].name

        chrome.contextMenus.create({
            id: `${name}.ImageSearch`,
            title: `Search image with ${name}`,
            contexts: ["image"]
        });
    }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {

    let { ImageSearchEngines } = await chrome.storage.local.get("ImageSearchEngines")
    if (!ImageSearchEngines) {
        return
    }

    let [searchName, searchType] = info.menuItemId.split(".")

    if (searchType === "ImageSearch") {
        let search = ImageSearchEngines.find(e => e.name == searchName)
        if (search) {
            let url = new URL(search.url)
            url.searchParams.set(search.qparam, info.srcUrl)
            chrome.tabs.create({ url: url.href });
        }
    }

});
  