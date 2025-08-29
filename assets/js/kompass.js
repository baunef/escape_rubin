// Hardcodierte Zielkoordinaten
const zielLat = 48.20835;
const zielLon = 16.37396;

// Ziel in HTML anzeigen
document.getElementById("ziel").innerHTML =
  `<p><strong>Zielkoordinaten:</strong> ${zielLat}, ${zielLon}</p>`;

// Optionen für Geolocation
const geoOptions = {
  enableHighAccuracy: true, // nutzt GPS, wenn verfügbar
  maximumAge: 0,            // keine alten Daten aus Cache
  timeout: 5000             // max. Wartezeit für neues Signal
};

// Aktuelle Koordinaten per GPS
if ("geolocation" in navigator) {
  navigator.geolocation.watchPosition(pos => {
    const lat = pos.coords.latitude.toFixed(5);
    const lon = pos.coords.longitude.toFixed(5);
    document.getElementById("aktuell").textContent = `${lat}, ${lon}`;
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
    const alpha = e.alpha; // 0–360 Grad
    if (alpha !== null) {
      document.getElementById("richtung").textContent =
        "Ausrichtung: " + alpha.toFixed(0) + "°";
      document.getElementById("arrow").style.transform =
        `rotate(${alpha}deg)`;
    }
  });
} else {
  document.getElementById("richtung").textContent =
    "DeviceOrientation wird nicht unterstützt.";
}