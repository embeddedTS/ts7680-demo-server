var val = { "LOW":1, "HIGH":0, "INPUT_LOW":1, "INPUT_HIGH":0 }
var nval = { "LOW":0, "HIGH":1, "INPUT_LOW":0, "INPUT_HIGH":1 }
var current, B_LED=0, G_LED=0, Y_LED=0, R_LED=0
var B_URL = "/gpio/56/"
var G_URL = "/gpio/5/"
var Y_URL = "/gpio/58/"
var R_URL = "/gpio/7/"

function $id(xxx) {
    return document.getElementById(xxx)
}

function AJaX(url,parms,success,failure) {
    var ob

    if (window.XMLHttpRequest) {
	ob=new XMLHttpRequest()
    } else if (window.ActiveXObject) {
	ob=new ActiveXObject("Microsoft.XMLHTTP")
    }
    if (ob) {
	if (typeof success == "function") {
	    ob.onreadystatechange= function() {
		if (this.readyState == 4) success(this.responseText,this)
	    }
	}
	ob.open(parms?"POST":"GET",url,typeof success == "function")
	if (typeof failure == "function") ob.onerror = failure
	if (parms) {
	    ob.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
	}
	if (parms) ob.send(parms); else ob.send()
    }
    return ob
}

function accel() {
    var dt = new google.visualization.DataTable()
    dt.addColumn("number", "X");
    dt.addColumn("number", "g");
    var t0
    var scale = 16384
    
    AJaX("/accelerometer/1000",null,function(data) {
	var samples = data.split("\n").map(function(sample) {
	    var s = sample.split(",")
	    s[0] = parseFloat(s[0])
	    if (!t0) t0 = s[0]
	    var a = Math.sqrt(Math.pow(s[1] / scale,2)
			      + Math.pow(s[2] / scale,2)
			      + Math.pow(s[3] / scale,2))
	    return [ s[0]-t0, a ]
	})
	dt.addRows(samples)
	var chart = new google.visualization.LineChart($id("accel_chart"))
	var options = {
	    hAxis: { title: "Time (ms)" },
	    vAxis: { title: "Acceleration" },
	}
	chart.draw(dt, options);
    })
}

function adc_update() {
    var data = google.visualization.arrayToDataTable([
          ["Label", "Value"],
          ["ADC1", 0],
          ["ADC2", 0],
          ["ADC3", 0],
          ["ADC4", 0],
          ["ADC5", 0],
          ["ADC6", 0],
          ["ADC7", 0],
          ["ADC8", 0]
    ])
    var options = {
        width: 800, height: 120,
        redFrom: 9, redTo: 10,
        yellowFrom:7.5, yellowTo: 9,
	max:10,
        minorTicks: 5
    }
    var chart = new google.visualization.Gauge($id("adc_chart"))
    chart.draw(data, options)
    setInterval(function() {
	AJaX("/adc",null,function(dt) {
	    var i, samples = dt.split("\n")
	    for (i=0;i<samples.length;i++) {
		var mV=((((samples[i]/10)*45177)*6235)/100000000)
		// replace this with calibrated values if needed
		data.setValue(i,1,samples[i]/3600)
		
	    }
	    chart.draw(data, options)
	})
    },1000)
}

function ts7680_update() {
    AJaX("/gpio/56,5,58,7",null,function(ok) {
	var leds = JSON.parse(ok).map(function(x,i) {
	    return (i==0) ? nval[x] : val[x]
	})
	B_LED = leds[0]
	G_LED = leds[1]
	Y_LED = leds[2]
	R_LED = leds[3]
	leds = leds.join("")
	if (current) {
	    if (current == $id("led"+leds)) return
	    current.style.display="none"
	}
	current = $id("led"+leds)
	current.style.display=""
    })
}

function toggle_led(evt) {
    var x = evt.offsetX, y = evt.offsetY, val, URL
    // 86,240 - 120,260 BLUE
    // 123,240 - 146,260 GREEN
    // 156,240 - 182,260 YELLOW
    // 183,240 - 211,260 RED
    if (y < 240 || y > 260) return
    if (x < 86) return
    if (x <= 120) { // BLUE
	B_LED = B_LED ? 0 : 1
	val = B_LED ? "HIGH" : "LOW"
	AJaX(B_URL+val)
    } else if (x <= 146) { // GREEN
	G_LED = G_LED ? 0 : 1
	val = G_LED ? "LOW" : "HIGH"
	AJaX(G_URL+val)
    } else if (x <= 182) { // YELLOW
	Y_LED = Y_LED ? 0 : 1
	val = Y_LED ? "LOW" : "HIGH"
	AJaX(Y_URL+val)
    } else if (x <= 211) { // RED
	R_LED = R_LED ? 0 : 1
	val = R_LED ? "LOW" : "HIGH"
	AJaX(R_URL+val)
    }
    current.style.display="none"
    current = $id("led"+B_LED+G_LED+Y_LED+R_LED)
    current.style.display=""
}

