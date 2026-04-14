(() => {
  console.log("[pplx-is-mine] Injected");
  
  let config = {
    endpoint: "perplexity.ai/rest/sse/perplexity_ask",
    model: null
  }
  window.addEventListener("message", (e) => {
    if (e.data.source !== "pplx-is-mine" || e.data.type !== "CONFIG")
      return

    config = {
      ...config,
      ...e.data.payload,
    }
  })
  window.postMessage({
    source: "pplx-is-mine",
    type: "GET_CONFIG",
  }, "*")

  const originalFetch = window.fetch.bind(window)
  window.fetch = async function(input, init) {
    const req = input instanceof Request ? input : new Request(input, init)
    const url = req.url
    if (!url.includes(config.endpoint) || req.method !== "POST" || !config.model)
      return originalFetch(input, init)

    let bodyJSON = null
    try {
      bodyJSON = await req.clone().json()
    } catch (_) {
      return originalFetch(input, init)
    }
    if (!bodyJSON)
      return originalFetch(input, init)
    
    bodyJSON.params.model_preference = config.model

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
