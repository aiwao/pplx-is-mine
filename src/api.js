console.log("[pplx-is-mine] Content loaded")

async function postConfig() {
  let endpoint = "perplexity.ai/rest/sse/perplexity_ask"

  try {
    const managed = await browser.storage.managed.get("pplx-ask-endpoint")
    endpoint = managed["pplx-ask-endpoint"] ?? endpoint
  } catch (e) {
    console.error(e)
  }

  const model = await browser.storage.local.get("pplx-is-mine-model")
  const config = {
    endpoint,
    model: model ?? null
  }
  window.postMessage({
    source: "pplx-is-mine",
    type: "CONFIG",
    payload: config,
  }, "*")
}

window.addEventListener("message", async (e) => {
  if (e.data.source !== "pplx-is-mine" || e.data.type !== "GET_CONFIG")
    return
  await postConfig()
})

browser.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== "local" && areaName !== "managed")
    return
  await sendConfigToPage();
});

sendConfigToPage();
