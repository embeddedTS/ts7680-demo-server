process.chdir(__dirname)
var server = require("express-modular-server")({
    http:true
})
    .API("gpio")
    .API("mma8451")
    .API("mx28adc")
    .API("app")
    .start()
