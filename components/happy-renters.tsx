// Real-style profile avatars (using DiceBear "personas" — generates clean, premium human-style portraits)
// All hosted, deterministic per seed, and CORS-friendly.
const RENTER_AVATARS = [
  {
    seed: "Aiman",
    src: "https://api.dicebear.com/7.x/personas/svg?seed=Aiman&backgroundColor=b6e3f4",
  },
  {
    seed: "Hassan",
    src: "https://api.dicebear.com/7.x/personas/svg?seed=Hassan&backgroundColor=ffd5dc",
  },
  {
    seed: "Sara",
    src: "https://api.dicebear.com/7.x/personas/svg?seed=Sara&backgroundColor=ffdfbf",
  },
  {
    seed: "Bilal",
    src: "https://api.dicebear.com/7.x/personas/svg?seed=Bilal&backgroundColor=c0aede",
  },
  {
    seed: "Maryam",
    src: "https://api.dicebear.com/7.x/personas/svg?seed=Maryam&backgroundColor=d1d4f9",
  },
]

export function HappyRenters() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex -space-x-3">
        {RENTER_AVATARS.map((a, i) => (
          <span
            key={a.seed}
            className="relative inline-grid h-11 w-11 place-items-center overflow-hidden rounded-full border-2 border-background bg-secondary ring-1 ring-primary/30"
            style={{ zIndex: RENTER_AVATARS.length - i }}
            aria-hidden
          >
            <img
              src={a.src || "/placeholder.svg"}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </span>
        ))}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-display text-lg font-bold">2,400+</span>
        <span className="text-xs text-muted-foreground">Happy renters</span>
      </div>
    </div>
  )
}
