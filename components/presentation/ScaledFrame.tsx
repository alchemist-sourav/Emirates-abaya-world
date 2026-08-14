import React from 'react'

interface ScaledFrameProps {
  url: string
  /** The simulated device width in px (e.g. 1440 desktop, 390 mobile) */
  viewportWidth: number
  /** The simulated device height in px */
  viewportHeight: number
  /** Render scale (1 = actual size) */
  scale: number
  label: string
}

/**
 * Renders a live preview of the site inside a simulated device viewport,
 * scaled down to fit the presentation layout.
 */
export function ScaledFrame({ url, viewportWidth, viewportHeight, scale, label }: ScaledFrameProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-lg overflow-hidden border border-[#E5E5E5] bg-white shadow-lg"
        style={{
          width: viewportWidth * scale,
          height: viewportHeight * scale,
        }}
        aria-label={`${label} preview`}
      >
        <iframe
          src={url}
          title={`${label} preview`}
          loading="lazy"
          className="absolute top-0 left-0 border-0 bg-white"
          style={{
            width: viewportWidth,
            height: viewportHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#111111]">{label}</span>
        <span className="text-[11px] text-gray-400">
          {viewportWidth} × {viewportHeight}
        </span>
      </div>
    </div>
  )
}