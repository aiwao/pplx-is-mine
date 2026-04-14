const webExt = require("web-ext").default || require("web-ext")

async function main() {
  const apiKey = process.env.AMO_JWT_ISSUER
  const apiSecret = process.env.AMO_JWT_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error('Missing AMO credentials')
  }

  await webExt.cmd.sign({
    apiKey,
    apiSecret,
    sourceDir: "./src",
    artifactsDir: "./build",
    channel: "listed",
    amoBaseUrl: "https://addons.mozilla.org/api/v5/",
    userAgentString: "pplx-is-mine-release-bot",
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
