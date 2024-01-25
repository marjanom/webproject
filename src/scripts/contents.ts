// contents.ts
import L from 'leaflet';

interface ScooterFeature {
    type: string;
    id: string;
    geometry: {
        type: string;
        coordinates: [number, number];
    };
    geometry_name: string;
    properties: {
        OBJECTID: number;
        ABSTELL_ID: number;
        BEZIRK: number;
        ADRESSE: string;
        STATUS: string;
        STATUS_TXT: string;
        ANZ_SCOOTER: number | null;
        WEBLINK1: string | null;
        ANL_TYP: string;
        ANL_TYP_TXT: string;
    };
}

function fetchScooterData(): Promise<ScooterFeature[]> {
    return fetch('/resources/SCOOTERABSTELLOGD.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data: { features: ScooterFeature[] }) => {
            return data.features;
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
            return [];
        });
}

function displayScooterOnMap(map: L.Map, data: ScooterFeature[]): void {
    data.forEach((feature: ScooterFeature) => {
        const coordinates = feature.geometry.coordinates;
        const properties = feature.properties;

        const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);

        marker.bindPopup(`ADRESSE: ${properties.ADRESSE}<br>ANZ_SCOOTER: ${properties.ANZ_SCOOTER}`).openPopup();
    });
}

// Beispielaufruf
const mymap = L.map('mapid', { center: [48.18956394, 16.36409597], zoom: 13 });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(mymap);

fetchScooterData().then(data => {
    displayScooterOnMap(mymap, data);
});
