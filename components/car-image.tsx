"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CarImageProps {
  src: string | undefined
  alt: string
  className?: string
  // when this key changes, image re-mounts (used for view toggles)
  viewKey?: string | number
}

const FALLBACK = "/car-placeholder.jpg"

/**
 * CarImage — robust <img> for externally hosted car photos.
 *
 * IMPORTANT IMPLEMENTATION NOTES:
 *  - We deliberately DO NOT set crossOrigin="anonymous". External CDNs
 *    (PakWheels, ZigWheels, hgmsites, propakistani, honda.com.pk, etc.)
 *    do not send CORS headers, so requesting CORS would CAUSE the
 *    browser to block the image entirely. We just need to display it.
 *  - referrerPolicy="no-referrer" helps bypass referrer-based hotlink
 *    protection (common on PakWheels & ZigWheels CDNs).
 *  - On error, we swap to a luxury placeholder so the layout stays clean.
 *  - object-cover guarantees consistent framing across all cards.
 */
export function CarImage({ src, alt, className, viewKey }: CarImageProps) {
  const [errored, setErrored] = useState(false)

  // reset error state when src changes (e.g. front <-> back toggle)
  useEffect(() => {
    setErrored(false)
  }, [src])

  // Strip blatantly invalid URLs (e.g. file:///C:/...) before render
  const safeSrc =
    !src || src.startsWith("file://") || errored ? FALLBACK : src

  return (
    <img
      key={viewKey ?? safeSrc}
      src={safeSrc || "/placeholder.svg"}
      alt={alt}
      onError={() => setErrored(true)}
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
    />
  )
}
