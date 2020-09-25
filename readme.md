# bme280-influx-weather

### Skript zur Erfassung der Messdaten des Bosch BME280 und der Integration in eine InfluxDB

## Inhalt
- Intro
- Installation InfluxDB bereits installiert
- Installation InfluxDB nicht installiert
- Nutzung
- Hilfreiches zur InfluxDB

### Intro
Das NodeJS Skript erfasst die Messdaten des BME280 über den I2C Bus und wertet diese aus.
Zusätzlich werden die Werte Absulute Feuchte, Dampfdruck und Taupunkt berechnet und diese mit den eigentlichen Messdaten in eine InfluxDB geschrieben.

### Installation InfluxDB bereits installiert!
1. Raspberry Pi aktuallisieren
2. Über die `raspi-config` I2C aktivieren
3. NodeJS und Node Paket Manager (NPM) installieren -> `sudo apt install nodejs npm`
4. Repo Klonen -> `git clone https://github.com/Fabian-Siebels/bme280-influx-weather.git`
5. Mit dem Befehl `cd bme280-influx-weather` in den Ordner wechseln
6. NodeJS Pakete hinzufügen -> `npm i bme280 influx`
7. Per Editor in die Datei `server.js` bearbeiten und die konstanten Variablen ändern
   > Standard: Server=localhost, Datenbankname=bme280weather, Measurementname=sensor, Messunsgwartezeit=30000 ms
8. Der Befehl `node server.js` startet den NodeJS Server und liest den Sensor aus
---
### Installation InfluxDB nicht installiert!
1. Raspberry Pi aktuallisieren
2. Über die `raspi-config` I2C aktivieren
3. InfluxDB PGP Key hinzufügen -> `wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -`
4. RaspberryOS Name in Globale Variable schreiben -> `source /etc/os-release`
5. InfluxDB Repo hinzufügen -> `echo "deb https://repos.influxdata.com/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/influxdb.list`
6. Raspberry Pi Updaten und InfluxDB installieren -> `sudo apt update && sudo apt install -y influxdb`
7. Damit die InfluxDB betriebsbereit ist, muss diese noch aktiviert und gestartet werden
   1. sudo systemctl unmask influxdb.service
   2. sudo systemctl start influxdb
   3. sudo systemctl enabke influxdb.service
8. NodeJS und Node Packet Manger (NPM) installieren -> `sudo apt install nodejs npm`
9. Repo Klonen -> `git clone https://github.com/Fabian-Siebels/bme280-influx-weather.git`
10. Mit dem Befehl `cd bme280-influx-weather` in den Ordner wechseln
11. NodeJS Pakete hinzufügen -> `npm i bme280 influx`
12. Per Editor in die Datei `server.js` bearbeiten und die konstanten Variablen ändern
   > Standard: Server=localhost, Datenbankname=bme280weather, Measurementname=sensor, Messunsgwartezeit=30000 ms
12. Der Befehl `node server.js` startet den NodeJS Server und liest den Sensor aus
---
### Nutzung

Um das Skript auf seine Bedürfnisse anpassen zu können, müssen die konstanten Variabeln angepasst werden.
Diese befinden sich in den ersten Zeilen des Skriptes (`server.js`)
> WICHTIG! Die Messungswartezeit muss in ms angegeben werden!
```javascript
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
```

---
### Hilfreiches zu InfluxDB

InfluxCLI öffenen

```
influx
```

User erstellen

`CREATE USER <name> WITH PASSWORD '<passwort>'`

Rechte einstellen

`GRANT ALL ON <name> TO <dbname>` 

Datenbank erstellen

`CREATE DATABASE <name>`

Datenbank auswählen

`USE <name>`

Mesurements anzeigen (Tabellen)

`SHOW measurements`

Daten anzeigen lassen

`SELECT * FROM <measurementName>`

Ganze Tabelle löschen

`DROP MEASUREMENT <measurementName>`