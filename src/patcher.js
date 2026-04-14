(() => {
  console.log("[pplx-is-mine] Injected");
  
  let extConfig = {
    pplxAskEndpoint: "perplexity.ai/rest/sse/perplexity_ask"
  }
  
  window.addEventListener("message", (e) => {
    if (e.data.source !== "pplx-is-mine")
      return

    if (e.data.type === "CONFIG") {
      config = e.data.payload
    } else if (e.data.type == "EXT_CONFIG") {
      extConfig = {
        ...extConfig,
        ...e.data.payload,
      }
    }
  })

  window.postMessage({
    source: "pplx-is-mine",
    type: "GET_CONFIG",
  }, "*")
  window.postMessage({
    source: "pplx-is-mine",
    type: "GET_EXT_CONFIG",
  }, "*")

  const originalFetch = window.fetch.bind(window)
  window.fetch = async function(input, init) {
    const req = input instanceof Request ? input : new Request(input, init)
    const url = req.url
    if (!url.includes(extConfig.pplxAskEndpoint) || req.method !== "POST")
      return originalFetch(input, init)

    let bodyJSON = null
    try {
      bodyJSON = await req.clone().json()
    } catch (_) {
      return originalFetch(input, init)
    }
    if (!bodyJSON)
      return originalFetch(input, init)
    
    bodyJSON = {
      ...bodyJSON,
      ...config
    }

    const patchedReq = new Request(req.url, {
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(bodyJSON),
      mode: req.mode,
      credentials: req.credentials,
      cache: req.cache,
      redirect: req.redirect,
      referrer: req.referrer,
      referrerPolicy: req.referrerPolicy,
      integrity: req.integrity,
      keepalive: req.keepalive,
      signal: req.signal
    })

    console.log("[pplx-is-mine] Request was patched")

    return originalFetch(patchedReq)
  }
})();
