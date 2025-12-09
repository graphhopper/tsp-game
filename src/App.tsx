import GameMap from './components/Map/GameMap'
import { useGameStore } from './store/gameStore'
import { Settings, Play, RotateCcw, BrainCircuit, HelpCircle, X, Trophy, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.ceil(seconds % 60);

  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function App() {
  const {
    generatePoints,
    resetGame,
    gameState,
    userDistance,
    userTime,
    aiDistance,
    aiTime,
    numberOfStops,
    setNumberOfStops,
    solveGame,
    userPath,
    aiPath,
    distanceMode,
    setDistanceMode
  } = useGameStore()

  const [showSettings, setShowSettings] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [viewMode, setViewMode] = useState<'both' | 'ai'>('both') // Toggle between both routes or AI only
  const [showRouteComparison, setShowRouteComparison] = useState(false)

  // Victory confetti when user beats GraphHopper on time or achieves perfect match
  useEffect(() => {
    if (aiTime > 0 && (userTime < aiTime || (userTime === aiTime && userDistance === aiDistance))) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347']
      });
    }
  }, [aiTime, userTime, userDistance, aiDistance]);

  return (
    <div className="w-full h-full bg-slate-900 text-white relative overflow-hidden">
      <GameMap viewMode={viewMode} />

      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 z-[1000] pointer-events-none flex justify-between items-start">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-slate-700 shadow-xl">
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">
              TSP Challenge
            </h1>
            <a href="https://graphhopper.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-cyan-400 transition-colors mb-3 block uppercase tracking-wider font-bold">
              Powered by GraphHopper API
            </a>

            <div className="space-y-4">
              {/* User Stats */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">You</div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">Road Distance:</span>
                  <span className="font-mono text-cyan-400">{(userDistance / 1000).toFixed(2)} km</span>
                </div>
                {userTime > 0 && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">Time:</span>
                    <span className="font-mono text-cyan-400">{formatTime(userTime)}</span>
                  </div>
                )}
              </div>

              {/* AI Stats */}
              {aiDistance > 0 && (
                <div className="space-y-1 pt-2 border-t border-slate-700">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">GraphHopper</div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">Road Distance:</span>
                    <span className="font-mono text-pink-500">{(aiDistance / 1000).toFixed(2)} km</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400">Time:</span>
                    <span className="font-mono text-pink-500">{formatTime(aiTime)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Game Hint */}
            {gameState === 'PLAYING' && (
              <div className="mt-4 pt-4 border-t border-slate-700 text-center">
                {useGameStore.getState().userPath.length === useGameStore.getState().points.length ? (
                  <div className="animate-pulse text-green-400 font-bold flex items-center justify-center gap-2">
                    <RotateCcw size={16} /> Return to Start!
                  </div>
                ) : (
                  <div className="text-slate-400 text-sm">
                    Visit all {numberOfStops} stops
                  </div>
                )}
              </div>
            )}

            {gameState === 'FINISHED' && (
              <div className="mt-4 pt-4 border-t border-slate-700 text-center">
                {aiTime > 0 && userTime < aiTime ? (
                  <div className="text-yellow-400 font-bold flex items-center justify-center gap-2 animate-pulse">
                    <Trophy size={16} /> You Beat GraphHopper! 🎉
                  </div>
                ) : aiTime > 0 && userTime === aiTime && userDistance === aiDistance ? (
                  <div className="text-yellow-400 font-bold flex items-center justify-center gap-2 animate-pulse">
                    <Trophy size={16} /> Perfect Match! 🎉
                  </div>
                ) : aiTime > 0 && userTime > aiTime && userDistance < aiDistance ? (
                  <div className="text-green-400 font-bold flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} /> Shorter Route Found!
                    </div>
                    <div className="text-xs text-slate-400 font-normal">
                      (GraphHopper optimizes for time)
                    </div>
                  </div>
                ) : aiTime > 0 ? (
                  <div className="text-slate-400 font-bold flex items-center justify-center gap-2">
                    GraphHopper Won This Time
                  </div>
                ) : (
                  <div className="text-yellow-400 font-bold flex items-center justify-center gap-2">
                    <Trophy size={16} /> Route Completed!
                  </div>
                )}
              </div>
            )}

            {/* Route Comparison */}
            {gameState === 'FINISHED' && aiPath.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowRouteComparison(!showRouteComparison)}
                  className="w-full flex items-center justify-between text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <span>Compare Routes</span>
                  {showRouteComparison ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showRouteComparison && (
                  <div className="mt-3 space-y-3 text-xs">
                    <div>
                      <div className="text-cyan-400 font-bold mb-1">Your Route:</div>
                      <div className="flex flex-wrap gap-1">
                        {userPath.map((idx, i) => (
                          <span
                            key={i}
                            className={`px-2 py-1 rounded ${idx === 0 ? 'bg-green-600' : 'bg-cyan-600'
                              } text-white font-mono text-xs`}
                          >
                            {idx === 0 ? 'S' : idx}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-pink-500 font-bold mb-1">GraphHopper Route:</div>
                      <div className="flex flex-wrap gap-1">
                        {aiPath.map((idx, i) => (
                          <span
                            key={i}
                            className={`px-2 py-1 rounded ${idx === 0 ? 'bg-green-600' : 'bg-pink-600'
                              } text-white font-mono text-xs`}
                          >
                            {idx === 0 ? 'S' : idx}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                generatePoints([48.1351, 11.5820], 5000, numberOfStops);
                setViewMode('both');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-lg font-bold transition-colors"
            >
              <Play size={18} /> New Game ({numberOfStops})
            </button>
            <button
              onClick={() => {
                resetGame();
                setViewMode('both');
              }}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg shadow-lg transition-colors"
              title="Reset"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg shadow-lg transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg shadow-lg transition-colors"
              title="How to Play"
            >
              <HelpCircle size={20} />
            </button>
            <a
              href="https://github.com/graphhopper/tsp-game"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 bg-slate-700 hover:bg-slate-600 rounded-lg shadow-lg transition-colors"
              title="View Source on GitHub"
            >
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
            </a>
          </div>

          {/* Compare Button */}
          {gameState === 'FINISHED' && aiDistance === 0 && (
            <button
              onClick={solveGame}
              className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl shadow-lg hover:shadow-cyan-500/50 font-bold transition-all duration-300 transform hover:-translate-y-1 w-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
              <BrainCircuit size={20} className="relative z-10" />
              <span className="relative z-10">Compare with GraphHopper</span>
            </button>
          )}

          {/* View Mode Toggle */}
          {aiDistance > 0 && (
            <button
              onClick={() => setViewMode(viewMode === 'both' ? 'ai' : 'both')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg shadow-lg font-bold transition-colors text-sm w-full justify-center"
            >
              {viewMode === 'both' ? '👁️ GraphHopper Only' : '👁️ Show Both'}
            </button>
          )}
        </div>

        {/* Removed right-side action buttons container */}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 p-6 rounded-2xl max-w-md w-full border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>

            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-1">
                Number of Stops: <span className="text-cyan-400 font-bold">{numberOfStops}</span>
              </label>
              <input
                type="range"
                min="3"
                max="50"
                value={numberOfStops}
                onChange={(e) => setNumberOfStops(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>3 (Easy)</span>
                <span>50 (Extreme)</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Distance Mode</label>
              <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                <button
                  onClick={() => setDistanceMode('road')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-all ${distanceMode === 'road'
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                  🚗 Road Network
                </button>
                <button
                  onClick={() => setDistanceMode('haversine')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-bold transition-all ${distanceMode === 'haversine'
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                  🦅 As the Crow Flies
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {distanceMode === 'road'
                  ? 'Calculates travel time and distance using real roads.'
                  : 'Calculates straight-line distance (faster, but less realistic).'}
              </p>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold transition-colors"
            >
              Save & Close
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="absolute inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 p-6 rounded-2xl max-w-md w-full border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="text-cyan-400" /> How to Play
            </h2>

            <div className="space-y-4 text-slate-300">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-white shrink-0">S</div>
                <div>
                  <h3 className="font-bold text-white">1. Start</h3>
                  <p className="text-sm">Click the <span className="text-green-400">Green Start Marker</span> to begin your journey.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-white shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-white">2. Connect Cities</h3>
                  <p className="text-sm">Click the <span className="text-cyan-400">Cyan City Markers</span> in the order you want to visit them.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-white shrink-0">S</div>
                <div>
                  <h3 className="font-bold text-white">3. Finish Loop</h3>
                  <p className="text-sm">Click the <span className="text-green-400">Start Marker</span> again to close the loop and finish.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center font-bold text-white shrink-0">
                  <BrainCircuit size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-white">4. Compare</h3>
                  <p className="text-sm">See how your route compares to GraphHopper's solution!</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold transition-colors mt-6"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
