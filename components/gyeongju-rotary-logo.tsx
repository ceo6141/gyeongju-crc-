export default function GyeongjuRotaryLogo({
  className = "",
  size = "large",
}: { className?: string; size?: "small" | "medium" | "large" }) {
  const dimensions = {
    small: { width: 200, height: 80, wheelSize: 50, textSize: "text-lg" },
    medium: { width: 300, height: 100, wheelSize: 70, textSize: "text-2xl" },
    large: { width: 400, height: 120, wheelSize: 90, textSize: "text-3xl" },
  }

  const { width, height, wheelSize, textSize } = dimensions[size]

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`} style={{ width, height }}>
      <div className="flex items-center gap-4">
        <span className={`font-bold text-blue-700 ${textSize} leading-tight`}>Rotary</span>
        <div className="flex-shrink-0">
          <svg width={wheelSize} height={wheelSize} viewBox="0 0 100 100" className="text-yellow-500">
            <g fill="currentColor">
              {Array.from({ length: 24 }, (_, i) => {
                const angle = (i * 15 * Math.PI) / 180
                const innerRadius = 38
                const outerRadius = 46
                const x1 = 50 + innerRadius * Math.cos(angle)
                const y1 = 50 + innerRadius * Math.sin(angle)
                const x2 = 50 + outerRadius * Math.cos(angle)
                const y2 = 50 + outerRadius * Math.sin(angle)
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )
              })}
              <circle cx="50" cy="50" r="36" fill="currentColor" />
              <circle cx="50" cy="50" r="26" fill="none" stroke="white" strokeWidth="2" />
              {Array.from({ length: 6 }, (_, i) => {
                const angle = (i * 60 * Math.PI) / 180
                const x = 50 + 20 * Math.cos(angle)
                const y = 50 + 20 * Math.sin(angle)
                return (
                  <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="white" strokeWidth="3" strokeLinecap="round" />
                )
              })}
              <circle cx="50" cy="50" r="8" fill="white" />
              <circle cx="50" cy="50" r="4" fill="currentColor" />
            </g>
          </svg>
        </div>
      </div>
      <span className="text-blue-600 text-sm font-medium text-center">Gyeongju Central Rotary Club</span>
    </div>
  )
}
