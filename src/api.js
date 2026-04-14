console.log("[pplx-is-mine] Content loaded")

async function postConfig() {
  let config = {}
  try {
    const storedConfig = await browser.storage.local.get("pplx-is-mine")
    if (storedConfig["pplx-is-mine"] !== undefined)
      config = storedConfig["pplx-is-mine"]
  } catch (e) {
    console.error(e)
  }

  window.postMessage({
    source: "pplx-is-mine",
    type: "CONFIG",
    payload: config,
  }, "*")
}

async function postExtensionConfig() {
  let config = {
    pplxAskEndpoint: "perplexity.ai/rest/sse/perplexity_ask"
  }

  try {
    const managedEndpoint = await browser.storage.managed.get("pplxAskEndpoint")
    config.pplxAskEndpoint = managedEndpoint
  } catch (e) {
    console.error(e)
  }

  window.postMessage({
    source: "pplx-is-mine",
    type: "EXT_CONFIG",
    payload: config,
  }, "*")
}

window.addEventListener("message", async (e) => {
  if (e.data.source !== "pplx-is-mine") return
  if (e.data.type === "GET_CONFIG") {
    await postConfig()
  } else if (e.data.type === "GET_EXT_CONFIG") {
    await postExtensionConfig()
  }
})

browser.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === "local") {
    await postConfig();
  } else if (areaName === "managed") {
    await postExtensionConfig()
  }
});

postConfig()
postExtensionConfig()
