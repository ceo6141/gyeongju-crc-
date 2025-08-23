interface RotaryLogoProps {
  width?: number
  height?: number
  className?: string
}

export function RotaryLogo({ width = 160, height = 100, className = "" }: RotaryLogoProps) {
  return (
    <div className={`inline-flex items-center ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 320 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Background */}
        <rect width="320" height="200" rx="8" fill="url(#blueGradient)" />

        {/* Rotary Wheel */}
        <g transform="translate(40, 50)">
          {/* Outer ring */}
          <circle cx="50" cy="50" r="45" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />

          {/* Inner circle */}
          <circle cx="50" cy="50" r="25" fill="#FFD700" />

          {/* Gear teeth */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 15 * Math.PI) / 180
            const x1 = 50 + 40 * Math.cos(angle)
            const y1 = 50 + 40 * Math.sin(angle)
            const x2 = 50 + 48 * Math.cos(angle)
            const y2 = 50 + 48 * Math.sin(angle)
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B8860B" strokeWidth="3" strokeLinecap="round" />
            )
          })}

          {/* Center hub */}
          <circle cx="50" cy="50" r="8" fill="#B8860B" />
        </g>

        {/* Text */}
        <text x="160" y="45" fill="white" fontSize="18" fontWeight="bold" textAnchor="start">
          Rotary
        </text>
        <text x="160" y="65" fill="white" fontSize="14" textAnchor="start">
          International
        </text>

        {/* Korean text */}
        <text x="160" y="120" fill="#FFD700" fontSize="16" fontWeight="bold" textAnchor="start">
          우리 함께 선행을
        </text>

        {/* Gradient definition */}
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
