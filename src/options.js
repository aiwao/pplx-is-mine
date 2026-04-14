const CONTROLLER_ID = "iam-a-storage-controller"
const ENTRY_SPECIAL_SUFFIX = "HOHOHOHOHOHOHOHO021930342303597340570"
const IN_DEV = (typeof browser === "undefined")

let internal_storage = {}

//Ctrller = Controller
let ctrllerKeyInput
let ctrllerValueInput
let ctrllerAddButton

const ctrllerContainer = document.getElementById("entries")
const mainContainer = document.getElementById("main-container")

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

function addStorageEntry(id, key, value) {
  const container = document.createElement("div")
  container.classList.add("row-container")
  container.id = id+ENTRY_SPECIAL_SUFFIX
  
  const keyInput = createInput(
    id+"-key",
    "Key",
    key
  )
  container.appendChild(keyInput)
  
  const valueInput = createInput(
    id+"-value",
    "Value",
    value
  )
  container.appendChild(valueInput)

  if (id === CONTROLLER_ID) {
    ctrllerKeyInput = keyInput
    ctrllerValueInput = valueInput
    container.appendChild(createButton(
      id+"-add",
      "Add",
      () => { handleAddButton() }
    ))
  } else {
    container.appendChild(createButton(
      id+"remove",
      "Remove",
      () => { handleRemoveButton(id) }
    ))
  }

  ctrllerContainer.appendChild(container)
  if (id === CONTROLLER_ID) {
    ctrllerContainer.appendChild(createSpacer("8px"))
  }
}

function setJSONValue(obj, path, value) {
  const keys = path.split('.')
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]

    if (
      current[key] === undefined ||
      current[key] === null ||
      typeof current[key] !== "object"
    ) {
      current[key] = {}
    }

    current = current[key]
  }

  if (value === undefined)
    return delete current[keys[keys.length - 1]]

  current[keys[keys.length - 1]] = value
  return obj
}

function handleAddButton() {
  const key = ctrllerKeyInput.value
  if (key === CONTROLLER_ID || internal_storage[key]) return

  const value = ctrllerValueInput.value
  addStorageEntry(key, key, value)
  internal_storage = setJSONValue(internal_storage, key, value)
  ctrllerKeyInput.value = ""
  ctrllerValueInput.value = ""
}

function handleRemoveButton(id) {
  const byId = document.getElementById(id+ENTRY_SPECIAL_SUFFIX)
  byId.remove()
  internal_storage = setJSONValue(internal_storage, id, undefined)
}

function addEntriesFromJSON(obj, prefix = "") {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      addEntriesFromJSON(value, path)
    } else {
      addStorageEntry(path, path, JSON.stringify(value))
    }
  }
}

function applyConfig() {
  
}

async function init() {
  let config
  if (IN_DEV) {
    config = {
      params: {
        model_preference: "gpt54_thinking"
      },
      query_str: "hello pplx"
    }
  } else {
    config = await browser.storage.local.get("pplx-is-mine")
  }
  internal_storage = config

  addStorageEntry(CONTROLLER_ID, "", "")
  addEntriesFromJSON(config)
  mainContainer.appendChild(createSpacer("8px"))
  mainContainer.appendChild(createButton(
    "apply",
    "Apply",
    () => { applyConfig() }
  ))
}

init()
