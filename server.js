// BME280 Sensor auslesen und in die InfluxDB schreiben

// const Influx = require('influx');
const bme280 = require('bme280');

// const influx = new Influx.InfluxDB({
//     host: "localhost",
//     database: "bme280weather",
//     schema: [{
//         measurement: 'sensor',
//         fields: {
//             temperatur: Influx.FieldType.FLOAT,
//             feuchtigkeit: Influx.FieldType.FLOAT,
//             luftdruck: Influx.FieldType.INTEGER,
//             taupunkt: Influx.FieldType.FLOAT
//         },
//         tags: [
//             "sensor"
//         ]
//     }]
// });

sensorErg;

bme280.open().then(async sensor => {
    // console.log(await sensor.read());
    sensorErg = await sensor.read();
    console.log("Versuche Einzutragen")
    await sensor.close();
}).catch(console.log);

console.log("Ergebnis= " + sensorErg);

var result = {
    temperatur: 25,
    feuchtigkeit: 50,
    luftdruck: 970,
    taupunkt: 17
}

t = result.temperatur;
r = result.feuchtigkeit;
p = result.luftdruck;

const mw = 18.016;
const gk = 8214.3;
const t0 = 273.15;
var tk = t + t0;

var a, b
if (t >= 0) {
    a = 7.5;
    b = 237.3;
} else if (t < 0) {
    a = 7.6;
    b = 240.7;
}

// Sättigungsdampfdruck (hPa)
var sdd = 6.1078 * Math.pow(10, (a*t)/(b+t));
 
// Dampfdruck (hPa)
var dd = sdd * (r/100);
                
// Wasserdampfdichte bzw. absolute Feuchte (g/m3)
af = Math.pow(10,5) * mw/gk * dd/tk; 
    
// v
v = Math.log10(dd/6.1078);

// Taupunkttemperatur (°C)
td = (b*v) / (a-v);


console.log("Dampfdruck = "+ Math.round(dd*100)/100 + " mbar");
console.log("Absulute Feuchte = "+ Math.round(af*100)/100 + " g/m³");
console.log("Taupunkt = "+ Math.round(td*100)/100 + " °C");

var dbtp = Math.round(td*100)/100;

var db = {
    temperatur: result.temperatur,
    feuchtigkeit: result.feuchtigkeit,
    luftdruck: result.luftdruck,
    taupunkt: dbtp
}
        
// function saveData(db) {
//     influx.writePoints([{
//         measurement: "sensor",
//         // tags: {
//         //     keywords: (result.tags.length > 0 ? result.tags.join(",") : [])
//         // },
//         fields: {
//             temperatur: db.temperatur,
//             feuchtigekeit: db.feuchtigkeit,
//             luftdruck: db.luftdruck,
//             taupunkt: db.taupunkt
//         },
//     }]).catch(err => {
//         console.error(`Error beim Einfügen: ${err.stack}`);
//     });
// }


// saveData(db);