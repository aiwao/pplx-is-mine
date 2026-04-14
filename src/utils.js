export async function getPPLXAskEndpoint() {
  const config = await browser.storage.managed.get("pplx-ask-endpoint")
  return config.pplxAskEndpoint ?? "perplexity.ai/rest/sse/perplexity_ask"
}
