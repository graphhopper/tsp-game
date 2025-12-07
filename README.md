# 🗺️ TSP Challenge

An interactive web game where you try to solve the Traveling Salesman Problem (TSP) and compete against GraphHopper's optimization algorithm.

![TSP Challenge](https://img.shields.io/badge/Game-TSP%20Challenge-cyan)
![License](https://img.shields.io/badge/License-MIT-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## 🎮 Play the Game

**[Play Now →](https://tsp-challenge.web.app)** *(Deployed on Firebase Hosting)*

## 🎯 What is TSP?

The **Traveling Salesman Problem (TSP)** is a classic optimization challenge: *Given a set of cities, find the shortest possible route that visits each city exactly once and returns to the starting point.*

It sounds simple, but TSP is NP-hard - the number of possible routes grows factorially with each city added!

## ✨ Features

- 🗺️ **Interactive Map** - Click to create your route on a real map (centered on Munich)
- 🎚️ **Adjustable Difficulty** - Choose from 3 to 50 stops
- 🚗 **Road Network Mode** - Calculate actual driving distances and times
- 🦅 **Crow Flies Mode** - Quick straight-line distance calculations
- 🤖 **Compare with GraphHopper** - See how your solution stacks up against professional route optimization
- 🎉 **Victory Confetti** - Celebrate when you beat the algorithm!
- 📱 **PWA Support** - Install as an app on your device

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [GraphHopper API Key](https://www.graphhopper.com/) (for route optimization features)

### Installation

```bash
# Clone the repository
git clone https://github.com/graphhopper/tsp-game.git
cd tsp-game

# Install dependencies
npm install

# Copy example environment file and add your API keys
cp .env.example .env
# Edit .env with your GraphHopper API key

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GRAPHHOPPER_API_KEY` | Yes | API key for route optimization and distance calculations. Get one at [graphhopper.com](https://www.graphhopper.com/) |
| `VITE_OMNISCALE_API_KEY` | No | API key for Omniscale map tiles. Falls back to Carto tiles if not provided. Get one at [omniscale.com](https://omniscale.com/) |

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Play

1. **Start** - Click the green Start marker to begin
2. **Connect** - Click cities (cyan markers) in your preferred order
3. **Complete** - Return to the Start marker to close the loop
4. **Compare** - Click "Compare with GraphHopper" to see the optimal solution

**Goal**: Find a route faster than GraphHopper's algorithm! 🏆

## 🛠️ Tech Stack

- **React 19** + TypeScript
- **Vite** - Build tool
- **Leaflet** + React-Leaflet - Interactive maps
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **GraphHopper API** - Route optimization
- **Firebase Hosting** - Deployment

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- Route optimization powered by [GraphHopper](https://www.graphhopper.com/)
- Map tiles by [Omniscale](https://omniscale.com/) (with [Carto](https://carto.com/) as fallback)

---

*Can you beat the algorithm? 🧠*
