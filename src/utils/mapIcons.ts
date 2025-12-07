import L from 'leaflet'

export const createCityIcon = (index: number) => {
  return L.divIcon({
    className: 'custom-city-marker',
    html: `
      <div class="w-8 h-8 rounded-full border-2 border-cyan-400 bg-slate-900/80 flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_15px_rgba(34,211,238,0.6)] backdrop-blur-sm transition-transform hover:scale-110">
        ${index}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
}

export const createStartIcon = () => {
  return L.divIcon({
    className: 'custom-start-marker',
    html: `
      <div class="w-8 h-8 rounded-full border-2 border-green-500 bg-slate-900/80 flex items-center justify-center text-green-500 font-bold shadow-[0_0_15px_rgba(34,197,94,0.6)] backdrop-blur-sm">
        S
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
}
