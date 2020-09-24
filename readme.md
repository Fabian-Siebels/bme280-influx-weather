# bme280-influx-weather

### Skript zur Erfassung der Messdaten des Bosch BME280 und der Integration in eine InfluxDB

## Inhalt
- Intro
- Installation InfluxDB bereits installiert
- Installation InfluxDB nicht installiert
- Nutzung

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
7. Per Editor in die Datei `server.js` bearbeiten und die Konstanten Variablen ändern
   > Standard: Server=localhost, Datenbankname=bme280weather, Measurementname=sensor, Messunsgwartezeit=30000 ms
8. Der Befehl `node server.js` startet den NodeJS Server und liest den Sensor aus

