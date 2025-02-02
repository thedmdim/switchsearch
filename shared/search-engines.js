const searchEngines = [
  { name: "Google", url: "https://www.google.com/search?q=" },
  { name: "Brave", url: "https://search.brave.com/search?q=" },
  { name: "Yandex", url: "https://ya.ru/search/?text=" },
];

searchEngines.forEach(se => {
  se.url = new URL(se.url)
  let params = Array.from(se.url.searchParams.keys())
  if (params.length == 1) {
      se.q = params[0]
  } else {
      console.error("more than 1 q param in searchEngines item")
  }
})

export default searchEngines;
