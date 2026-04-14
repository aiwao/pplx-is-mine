import { getPPLXAskEndpoint } from "./utils"


self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    const pplxAskEndpoint = getPPLXAskEndpoint()
    if (
      !url.includes(pplxAskEndpoint)
      || event.request.method != "POST"
    ) {
      const res = await fetch(event.request)
      return res
    }
    
    const model = browser.storage.local.get("pplx-is-mine-model")
    const requestClone = await event.request.clone()
    const bodyJSON = await requestClone.json()
    if (!bodyJSON) {
      const res = await fetch(event.request)
      return res
    }
    
    console.log(bodyJSON)
  }))
})
