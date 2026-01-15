export default function Logo({
  className = "h-10 w-auto",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle with horizontal bands */}
      <defs>
        <clipPath id="circleClip">
          <circle cx="50" cy="50" r="45" />
        </clipPath>
      </defs>

      {/* Horizontal stripes in circle */}
      <g clipPath="url(#circleClip)">
        <rect x="5" y="5" width="90" height="12" fill="#7A9FB0" />
        <rect x="5" y="17" width="90" height="12" fill="#6B8FA0" />
        <rect x="5" y="29" width="90" height="12" fill="#5A8290" />
        <rect x="5" y="41" width="90" height="12" fill="#2C5F6F" />
        <rect x="5" y="53" width="90" height="12" fill="#1A4F5F" />
        <rect x="5" y="65" width="90" height="12" fill="#004346" />
        <rect x="5" y="77" width="90" height="13" fill="#2C5F6F" />
      </g>

      {/* Basketball seam lines - drawn last to appear on top */}
      <g
        clipPath="url(#circleClip)"
        fill="none"
        stroke="#09BC8A"
        strokeWidth="4.5"
        strokeLinecap="round"
      >
        {/* Vertical center line */}
        <line x1="50" y1="5" x2="50" y2="95" />

        {/* Horizontal center line (equator) */}
        <line x1="5" y1="50" x2="95" y2="50" />

        {/* Left curve - stronger curvature */}
        <path d="M 20 5 Q 40 50 20 95" />

        {/* Right curve - stronger curvature */}
        <path d="M 80 5 Q 60 50 80 95" />
      </g>
    </svg>
  );
}
