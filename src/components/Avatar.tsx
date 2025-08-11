type Props = {
  name?: string | null
  size?: number
}

export default function Avatar({ name = "User", size = 32 }: Props) {
  const initials = (name || "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join("") || "U"

  const style = { width: size, height: size, fontSize: Math.max(12, Math.floor(size * 0.4)) }

  return (
    <div
      className="rounded-full bg-slate-200 text-slate-700 grid place-items-center font-semibold"
      style={style as any}
      aria-label={name || "User"}
      title={name || "User"}
    >
      {initials}
    </div>
  )
}

