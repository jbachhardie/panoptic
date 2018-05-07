const delegate = eventName => (...args) =>
  process.send({ eventName, message: args })

console.debug = delegate("log-debug")
console.error = delegate("log-error")
console.info = delegate("log-info")
console.log = delegate("log-raw")
console.warn = delegate("log-warn")

console.debug("Service started")

require(process.argv[process.argv.length - 1])
