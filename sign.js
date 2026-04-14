const fs = require("node:fs")
const path = require("node:path")
const webExt = require("web-ext").default || require("web-ext")

async function main() {
  const version = process.env.VERSION || "dev"
  const artifactsDir = path.resolve("./build")
  const apiKey = process.env.AMO_JWT_ISSUER
  const apiSecret = process.env.AMO_JWT_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error('Missing AMO credentials')
  }

  await webExt.cmd.sign({
    apiKey,
    apiSecret,
    sourceDir: "./src",
    artifactsDir: artifactsDir,
    channel: "unlisted",
    amoBaseUrl: "https://addons.mozilla.org/api/v5/",
    userAgentString: "pplx-is-mine-release-bot",
  })

  const files = fs.readdirSync(artifactsDir).filter((f) => f.endsWith('.xpi'));
  if (files.length === 0) throw new Error('signed xpi not found');

  const src = path.join(artifactsDir, files[0]);
  const dest = path.join(artifactsDir, `perplexity_is_mine-${version}.xpi`);
  fs.renameSync(src, dest);
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
