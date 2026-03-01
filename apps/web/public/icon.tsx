import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export default function DivineMoonIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      {...props}
    >
      {/* --- The Soft Outer Halo (Subtle Glow) --- */}
      <rect x="5" y="2" width="5" height="12" fill="#A0AEC0" opacity="0.1" />
      <rect x="2" y="5" width="12" height="6" fill="#A0AEC0" opacity="0.1" />

      {/* --- The Silver "Rim Light" (Brightest Highlight) --- */}
      <rect x="6" y="2" width="3" height="1" fill="#FFFFFF" />
      <rect x="4" y="3" width="3" height="1" fill="#FFFFFF" />
      <rect x="3" y="4" width="2" height="1" fill="#FFFFFF" />
      <rect x="2" y="5" width="1" height="6" fill="#FFFFFF" />
      <rect x="3" y="11" width="2" height="1" fill="#FFFFFF" />
      <rect x="4" y="12" width="3" height="1" fill="#FFFFFF" />
      <rect x="6" y="13" width="3" height="1" fill="#FFFFFF" />

      {/* --- Moon Surface (Lustrous Grey Gradient) --- */}
      <rect x="7" y="3" width="1" height="1" fill="#CBD5E0" />
      <rect x="5" y="4" width="2" height="1" fill="#CBD5E0" />
      <rect x="3" y="5" width="3" height="6" fill="#A0AEC0" />
      <rect x="6" y="6" width="1" height="4" fill="#A0AEC0" />
      <rect x="5" y="11" width="2" height="1" fill="#CBD5E0" />
      <rect x="7" y="12" width="1" height="1" fill="#CBD5E0" />

      {/* --- Artistic Craters (Deep Depth) --- */}
      <rect x="4" y="6" width="1" height="1" fill="#4A5568" />
      <rect x="3" y="8" width="1" height="1" fill="#718096" />
      <rect x="5" y="9" width="1" height="1" fill="#4A5568" opacity="0.5" />

      {/* --- Inner Shadow (The Crescent Curve) --- */}
      <rect x="7" y="4" width="1" height="1" fill="#2D3748" />
      <rect x="6" y="5" width="1" height="1" fill="#2D3748" />
      <rect x="7" y="6" width="1" height="4" fill="#2D3748" />
      <rect x="6" y="10" width="1" height="1" fill="#2D3748" />
      <rect x="7" y="11" width="1" height="1" fill="#2D3748" />

      {/* --- Ethereal Star (Yellow & White Blend) --- */}
      {/* Star Core */}
      <rect x="12" y="3" width="1" height="1" fill="#FFF9E1" />
      {/* Star Bloom */}
      <rect x="12" y="2" width="1" height="3" fill="#FAF089" opacity="0.4" />
      <rect x="11" y="3" width="3" height="1" fill="#FAF089" opacity="0.4" />
      {/* Single Distant Sparkle */}
      <rect x="14" y="7" width="1" height="1" fill="#E2E8F0" opacity="0.6" />
      <rect x="11" y="13" width="1" height="1" fill="#FAF089" opacity="0.3" />
    </svg>
  );
}
