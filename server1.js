const bme280 = require('bme280')

bmeMessung();


function bmeMessung() {
    bme280.open().then(async sensor => {
        const sensorErgebnis = await sensor.read();
        console.log("Messung startet!");

        t = sensorErgebnis.temperature;
        r = sensorErgebnis.humidity;
        p = sensorErgebnis.pressure;

        const mw = 18.016;
        const gk = 8214.3;
        const t0 = 273.15;
        let tk = t + t0;

        var a, b
        if (t >= 0) {
            a = 7.5;
            b = 237.3;
        } else if (t < 0) {
            a = 7.6;
            b = 240.7;
        }

        // Sättigungsdampfdruck (hPa)
        var sdd = 6.1078 * Math.pow(10, (a * t) / (b + t));

        // Dampfdruck (hPa)
        var dd = sdd * (r / 100);

        // Wasserdampfdichte bzw. absolute Feuchte (g/m3)
        af = Math.pow(10, 5) * mw / gk * dd / tk;

        // v
        v = Math.log10(dd / 6.1078);

        // Taupunkttemperatur (°C)
        td = (b * v) / (a - v);

        console.log("Temperatur: " + t);
        console.log("Feuchtigkeit: " + r);
        console.log("Luftdruck: " + p);
        console.log("Dampfdruck = "+ Math.round(dd*100)/100 + " mbar");
        console.log("Absulute Feuchte = "+ Math.round(af*100)/100 + " g/m³");
        console.log("Taupunkt = "+ Math.round(td*100)/100 + " °C");

        await sensor.close();
    }).catch(console.log);
}