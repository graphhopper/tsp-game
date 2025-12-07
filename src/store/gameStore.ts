import { create } from 'zustand'
import { calculateTotalDistance } from '../utils/geometry'
import { solveTSP, getRouteWithFixedSequence } from '../services/graphHopper'

export interface Point {
    lat: number;
    lng: number;
    id: string;
}

interface GameState {
    points: Point[];
    userPath: number[]; // Indices of points in visited order
    gameState: 'IDLE' | 'PLAYING' | 'CALCULATING' | 'FINISHED';
    userDistance: number;
    userTime: number;
    aiDistance: number;
    aiTime: number;
    aiPath: number[]; // Indices of points in optimized order
    numberOfStops: number;
    distanceMode: 'road' | 'haversine';

    setNumberOfStops: (count: number) => void;
    setDistanceMode: (mode: 'road' | 'haversine') => void;
    generatePoints: (center: [number, number], radius: number, count: number) => void;
    addPointToPath: (index: number) => void;
    resetGame: () => void;
    solveGame: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
    points: [],
    userPath: [],
    gameState: 'IDLE',
    userDistance: 0,
    userTime: 0,
    aiDistance: 0,
    aiTime: 0,
    aiPath: [],
    numberOfStops: parseInt(localStorage.getItem('numberOfStops') || '10'),
    distanceMode: (localStorage.getItem('distanceMode') as 'road' | 'haversine') || 'haversine',

    setNumberOfStops: (count) => {
        localStorage.setItem('numberOfStops', count.toString());
        set({ numberOfStops: count });
    },

    setDistanceMode: (mode) => {
        localStorage.setItem('distanceMode', mode);
        set({ distanceMode: mode });
    },

    generatePoints: (center, radius, count) => {
        const newPoints: Point[] = [];
        for (let i = 0; i < count; i++) {
            const r = radius * Math.sqrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const latOffset = (r * Math.cos(theta)) / 111000;
            const lngOffset = (r * Math.sin(theta)) / (111000 * Math.cos(center[0] * (Math.PI / 180)));

            newPoints.push({
                lat: center[0] + latOffset,
                lng: center[1] + lngOffset,
                id: i.toString(),
            });
        }
        set({ points: newPoints, userPath: [], gameState: 'PLAYING', userDistance: 0, userTime: 0, aiDistance: 0, aiTime: 0, aiPath: [] });
    },

    addPointToPath: (index) => {
        const { gameState, userPath, points } = get();
        if (gameState !== 'PLAYING') return;

        if (userPath.length === 0) {
            if (index === 0) set({ userPath: [0] });
            return;
        }

        const lastPointIndex = userPath[userPath.length - 1];
        if (lastPointIndex === index) return;

        if (index === 0 && userPath.length === points.length) {
            const newPath = [...userPath, 0];
            // Keep straight line distance for immediate feedback, but we'll overwrite it with API data later
            const distance = calculateTotalDistance(points, newPath);
            set({ userPath: newPath, gameState: 'FINISHED', userDistance: distance });
            return;
        }

        if (userPath.includes(index)) return;

        const newPath = [...userPath, index];
        const distance = calculateTotalDistance(points, newPath);
        set({ userPath: newPath, userDistance: distance });
    },

    solveGame: async () => {
        const { points, userPath, distanceMode } = get();
        const apiKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY;

        if (!apiKey) {
            alert('API Key not configured! Please check .env file.');
            return;
        }

        set({ gameState: 'CALCULATING' });

        try {
            // 1. Get User's actual driving distance and time using optimization API with fixed sequence
            const userOrderedPoints = userPath.map(i => points[i]);
            const userRouteResponse = await getRouteWithFixedSequence(userOrderedPoints, apiKey, distanceMode);
            const userRoute = userRouteResponse.solution.routes[0];

            const userRoadDistance = userRoute.distance;
            const userRoadTime = userRoute.completion_time; // Optimization API returns seconds

            // 2. Solve TSP
            const solution = await solveTSP(points, apiKey, distanceMode);
            const aiRoute = solution.solution.routes[0];
            const aiDist = aiRoute.distance;
            const aiTime = aiRoute.completion_time; // VRP returns seconds

            const activities = aiRoute.activities;
            const aiPathIndices = activities.map((act: any) => {
                if (act.type === 'start' || act.type === 'end') return 0;
                return points.findIndex(p => p.id === act.id);
            });

            set({
                gameState: 'FINISHED',
                userDistance: userRoadDistance,
                userTime: userRoadTime,
                aiDistance: aiDist,
                aiTime: aiTime,
                aiPath: aiPathIndices,
            });

        } catch (error) {
            console.error('Error solving TSP:', error);
            set({ gameState: 'FINISHED' });
            alert('Failed to solve TSP. Check API Key.');
        }
    },

    resetGame: () => set({ points: [], userPath: [], gameState: 'IDLE', userDistance: 0, userTime: 0, aiDistance: 0, aiTime: 0, aiPath: [] }),
}))
