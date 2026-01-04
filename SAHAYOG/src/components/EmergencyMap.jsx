import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

/* Fix default marker icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function EmergencyMap({ onLocationChange }) {
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(
        !navigator.geolocation
            ? "Geolocation is not supported by your browser."
            : null
    );

    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const newPosition = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                setPosition(newPosition);
                if (onLocationChange) {
                    onLocationChange(newPosition);
                }
            },
            () => {
                setError("Location access denied.");
            },
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [onLocationChange]);

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!position) {
        return <p>Getting your location...</p>;
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <MapContainer
                center={position}
                zoom={16}
                style={{ width: "100%", height: "100%", borderRadius: "14px" }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={position}>
                    <Popup>
                        You are here <br />
                        <strong>Emergency location</strong>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
