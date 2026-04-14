function setConfigToStorage(obj) {
  return browser.storage.local.set({ "pplx-is-mine": obj })
}

function createButton(id, label, onclick) {
  const result = document.createElement("button")
  result.id = id
  result.innerText = label
  result.onclick = onclick
  return result
}

function createInput(id, placeholder, value) {
  const result = document.createElement("input")
  result.id = id
  result.placeholder = placeholder
  result.value = value
  return result
}

function createSpacer(height) {
  const result = document.createElement("div")
  result.style = `height: ${height};`
  return result
}
