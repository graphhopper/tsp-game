import axios from 'axios';
import type { Point } from '../store/gameStore';

const GH_API_URL = 'https://graphhopper.com/api/1';

export const solveTSP = async (points: Point[], apiKey: string, distanceMode: 'road' | 'haversine' = 'road') => {
    // Construct VRP problem
    // First point is start/end (depot)
    const depot = points[0];
    const services = points.slice(1).map((p) => ({
        id: p.id,
        address: {
            location_id: p.id,
            lon: p.lng,
            lat: p.lat
        }
    }));

    const problem = {
        vehicles: [{
            vehicle_id: 'my_vehicle',
            type_id: 'custom_vehicle_type',
            start_address: {
                location_id: depot.id,
                lon: depot.lng,
                lat: depot.lat
            },
            return_to_depot: true
        }],
        vehicle_types: [{
            type_id: 'custom_vehicle_type',
            profile: distanceMode === 'haversine' ? 'as_the_crow_flies' : 'car'
        }],
        services: services,
        configuration: {
            routing: {
                calc_points: distanceMode !== 'haversine'
            }
        },
        objectives: [
            {
                type: 'min',
                value: 'route_duration'
            }
        ]
    };

    const response = await axios.post(`${GH_API_URL}/vrp?key=${apiKey}`, problem);
    return response.data;
};

export const getRouteWithFixedSequence = async (points: Point[], apiKey: string, distanceMode: 'road' | 'haversine' = 'road') => {
    // Use optimization API with fixed sequence to get consistent travel times
    // First point is the depot (start/end)
    const depot = points[0];

    // Create services for all points except the depot
    const services = points.slice(1).map((p) => ({
        id: p.id,
        type: 'service',
        address: {
            location_id: p.id,
            lat: p.lat,
            lon: p.lng
        },
        duration: 0 // No service duration for TSP
    }));

    // Create the sequence of service IDs in the order they appear
    const serviceIds = services.map(s => s.id);

    const problem = {
        vehicles: [{
            vehicle_id: 'v1',
            type_id: 'custom_vehicle_type',
            start_address: {
                location_id: 'depot',
                lat: depot.lat,
                lon: depot.lng
            },
            return_to_depot: true
        }],
        vehicle_types: [{
            type_id: 'custom_vehicle_type',
            profile: distanceMode === 'haversine' ? 'as_the_crow_flies' : 'car'
        }],
        services: services,
        relations: [
            {
                type: 'in_direct_sequence',
                ids: serviceIds
            }
        ],
        configuration: {
            routing: {
                calc_points: distanceMode !== 'haversine',
                return_snapped_waypoints: distanceMode !== 'haversine'
            }
        },
        objectives: [
            {
                type: 'min',
                value: 'route_duration'
            }
        ]
    };

    const response = await axios.post(`${GH_API_URL}/vrp?key=${apiKey}`, problem);
    return response.data;
};
