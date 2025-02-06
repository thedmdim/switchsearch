import { TextSearchEngines, ImageSearchEngines } from "./shared/search-engines.js";
  
browser.runtime.onInstalled.addListener(async () => {

    browser.storage.local.set({TextSearchEngines: TextSearchEngines});
    browser.storage.local.set({ImageSearchEngines: ImageSearchEngines});

    for (let k in ImageSearchEngines) {
        browser.contextMenus.create({
            id: `${k}.ImageSearch`,
            title: `Search image with ${k}`,
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

    console.log(25)
    console.log(searchName)
    console.log(searchType)
    if (searchType === "ImageSearch") {
        let search = ImageSearchEngines[searchName]
        if (search) {
            let url = new URL(search.url)
            url.searchParams.set(search.qparam, info.srcUrl)
            chrome.tabs.create({ url: url.href });
        }
    }

});

  