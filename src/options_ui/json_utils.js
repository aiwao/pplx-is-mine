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

function hasJSONPath(obj, path) {
  if (!obj || typeof obj !== "object") return false
  
  return path.split(".").every(key => {
    if (obj && typeof obj === "object" && key in obj) {
      obj = obj[key]
      return true
    }
    return false
  })
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
