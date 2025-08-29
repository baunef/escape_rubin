// Hardcodierte Zielkoordinaten
const zielLat = 48.20835;
const zielLon = 16.37396;

// Ziel in HTML anzeigen
document.getElementById("ziel").innerHTML =
  `<p><strong>Zielkoordinaten:</strong> ${zielLat}, ${zielLon}</p>
   <p id="distanz">Entfernung: -</p>`;

// Optionen für Geolocation
const geoOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 5000
};

let aktuelleLat = null;
let aktuelleLon = null;
let aktuelleAusrichtung = null; // Geräteausrichtung in Grad

// Hilfsfunktion: Haversine-Formel zur Distanzberechnung
function berechneDistanz(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Erdradius in Metern
  const toRad = x => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Hilfsfunktion: Berechnet Peilwinkel (Bearing) zwischen zwei Koordinaten
function berechneBearing(lat1, lon1, lat2, lon2) {
  const toRad = x => (x * Math.PI) / 180;
  const toDeg = x => (x * 180) / Math.PI;

  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  let brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360; // 0–360 Grad
}

// Aktualisiert Pfeil-Ausrichtung
function updateKompass() {
  if (aktuelleLat !== null && aktuelleLon !== null && aktuelleAusrichtung !== null) {
    const zielBearing = berechneBearing(aktuelleLat, aktuelleLon, zielLat, zielLon);
    const relative = zielBearing - aktuelleAusrichtung;
    document.getElementById("arrow").style.transform = `rotate(${relative}deg)`;
    document.getElementById("richtung").textContent =
      `Ausrichtung: ${aktuelleAusrichtung.toFixed(0)}° | Zielrichtung: ${zielBearing.toFixed(0)}°`;
  }
}

// GPS: aktuelle Position
if ("geolocation" in navigator) {
  navigator.geolocation.watchPosition(pos => {
    aktuelleLat = pos.coords.latitude;
    aktuelleLon = pos.coords.longitude;

    document.getElementById("aktuell").textContent =
      `${aktuelleLat.toFixed(5)}, ${aktuelleLon.toFixed(5)}`;

    // Distanz berechnen
    const distanz = berechneDistanz(aktuelleLat, aktuelleLon, zielLat, zielLon);
    let text = distanz > 1000
      ? (distanz / 1000).toFixed(2) + " km"
      : distanz.toFixed(0) + " m";

    document.getElementById("distanz").textContent = "Entfernung: " + text;

    updateKompass();
  }, err => {
    document.getElementById("aktuell").textContent =
      "Fehler beim Zugriff auf Geolocation: " + err.message;
  }, geoOptions);
} else {
  document.getElementById("aktuell").textContent =
    "Geolocation wird nicht unterstützt.";
}

// Kompass / Geräteausrichtung
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", e => {
    if (e.alpha !== null) {
      aktuelleAusrichtung = e.alpha; // 0° = Norden
      updateKompass();
    }
  });
} else {
  document.getElementById("richtung").textContent =
    "DeviceOrientation wird nicht unterstützt.";
}