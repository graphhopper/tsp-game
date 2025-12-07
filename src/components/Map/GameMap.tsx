import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet'
import type { LatLngExpression, LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useGameStore } from '../../store/gameStore'
import { createCityIcon, createStartIcon } from '../../utils/mapIcons'
import { useState } from 'react'

interface GameMapProps {
    center?: LatLngExpression;
    zoom?: number;
    viewMode?: 'both' | 'ai';
}

const MapEvents = ({ onMouseMove }: { onMouseMove: (e: LatLng) => void }) => {
    useMapEvents({
        mousemove: (e) => onMouseMove(e.latlng),
    })
    return null
}

const GameMap = ({ center = [48.1351, 11.5820], zoom = 13, viewMode = 'both' }: GameMapProps) => {
    const { points, userPath, aiPath, addPointToPath, gameState } = useGameStore()
    const [mousePos, setMousePos] = useState<LatLng | null>(null)

    const pathCoordinates = userPath.map(index => [points[index].lat, points[index].lng] as LatLngExpression);
    const aiPathCoordinates = aiPath.map(index => [points[index].lat, points[index].lng] as LatLngExpression);

    const handleMouseMove = (latlng: LatLng) => {
        if (gameState === 'PLAYING' && userPath.length > 0) {
            setMousePos(latlng)
        } else {
            setMousePos(null)
        }
    }

    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                className="w-full h-full"
                zoomControl={false}
            >
                <MapEvents onMouseMove={handleMouseMove} />
                <TileLayer
                    className="map-tiles-dark"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://maps.omniscale.com/">Omniscale</a>'
                    url={`https://maps.omniscale.net/v2/${import.meta.env.VITE_OMNISCALE_API_KEY}/style.grayscale/{z}/{x}/{y}.png`}
                />

                {points.map((point, index) => (
                    <Marker
                        key={point.id}
                        position={[point.lat, point.lng]}
                        icon={index === 0 ? createStartIcon() : createCityIcon(index)}
                        eventHandlers={{
                            click: () => addPointToPath(index)
                        }}
                    />
                ))}

                {/* User Path - only show in 'both' mode */}
                {viewMode === 'both' && (
                    <Polyline
                        positions={pathCoordinates}
                        pathOptions={{ color: '#06b6d4', weight: 4, opacity: 0.8 }}
                    />
                )}

                {/* Rubber Band Line - only show in 'both' mode */}
                {viewMode === 'both' && gameState === 'PLAYING' && userPath.length > 0 && mousePos && (
                    <Polyline
                        positions={[
                            [points[userPath[userPath.length - 1]].lat, points[userPath[userPath.length - 1]].lng],
                            mousePos
                        ]}
                        pathOptions={{ color: '#06b6d4', weight: 2, opacity: 0.4, dashArray: '5, 5' }}
                    />
                )}

                {/* AI Path */}
                {aiPath.length > 0 && (
                    <Polyline
                        positions={aiPathCoordinates}
                        pathOptions={{ color: '#ec4899', weight: 4, opacity: 0.6, dashArray: '5, 10' }}
                    />
                )}
            </MapContainer>
        </div>
    )
}

export default GameMap
