// components/Avatar.tsx
import React from "react";

type AvatarProps = {
  name?: string | null;
  src?: string | null;
  size?: number; // px
  className?: string;
};

function getInitials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() || "").join("") || "?";
}

export default function Avatar({ name, src, size = 36, className = "" }: AvatarProps) {
  const initials = getInitials(name);
  const dimension = { width: size, height: size };

  if (src) {
    return (
      <img
        src={src}
        alt={name || "User"}
        className={`inline-block rounded-full object-cover ${className}`}
        style={dimension}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-medium select-none ${className}`}
      style={{
        ...dimension,
        background: "rgba(59,130,246,0.12)", // subtle brand-tinted bg
        color: "#1f2937", // gray-800
      }}
      aria-label={name || "User"}
      title={name || "User"}
    >
      <span style={{ fontSize: Math.max(12, Math.floor(size * 0.4)) }}>{initials}</span>
    </div>
  );
}

