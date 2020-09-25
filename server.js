// Skript zur erfassung der BME280 Messungsdaten in eine Influx Datenbank
// Made by Fabian Siebels
// Version 1.3

// Einstellungsvariablen

// Name des Hostes
const serverhost = "localhost";
// Name der Datenbank
const dbname = "bme280weather";
// Name des Measurements
const measurementname = "sensor";
// Wartezeit zwischen den Messungen in ms
// WICHTIG Zeit in Millisekunden angeben!
const messungswartezeit = "30000";



// Import der nodeJS Pakete bme280 und influx
const bme280 = require('bme280');
const Influx = require('influx');

// Starten der Messung
bmeMessung();

// Interval zur Ausfuehrung der Messung
setInterval(bmeMessung, messungswartezeit);

// Erstellen einer Influx Klasse
const influx = new Influx.InfluxDB({
    host: serverhost,
    database: dbname,
    schema: [{
        measurement: measurementname,
        fields: {
            temperatur: Influx.FieldType.FLOAT,
            feuchtigkeit: Influx.FieldType.FLOAT,
            luftdruck: Influx.FieldType.FLOAT,
            taupunkt: Influx.FieldType.FLOAT,
            absuluteFeuchte: Influx.FieldType.FLOAT,
            dampfdruck: Influx.FieldType.FLOAT
        },
        tags: [
            measurementname
        ]
    }]
});

// Überprüfe ob die Datenbank vorhanden ist, sonnst erstellen
influx.getDatabaseNames()
  .then(names => {
    if (!names.includes(dbname)) {
      return influx.createDatabase(dbname);
    }
  })


// Messung und write in die DB
function bmeMessung() {
    bme280.open().then(async sensor => {
        const sensorErgebnis = await sensor.read();
        console.log("Messung startet!");
        // Erfassen der Daten
        t = sensorErgebnis.temperature; // Temperatur
        r = sensorErgebnis.humidity;    // Feuchtigkeit
        p = sensorErgebnis.pressure;    // Luftdruck

        // Konstante Angaben fuer die Berechnung des Taupunktes, Sättigungsdruck und Wasserdampfdichte
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
        // Schreibvorgang in die Influx Datenbank
        influx.writePoints([{
            measurement: measurementname,
                fields: {
                    temperatur: t.toFixed(2),
                    feuchtigkeit: r.toFixed(2),
                    luftdruck: p.toFixed(2),
                    dampfdruck: Math.round(dd*100)/100,
                    absuluteFeuchte: Math.round(af*100)/100,
                    taupunkt: Math.round(td*100)/100
                },
        }]).catch(err => {
            console.error(`Error beim Einfuegen in die DB: ${err.stack}`);
        });

        await sensor.close();
    }).catch(console.log);
}