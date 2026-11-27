import { useEffect, useRef } from 'react'

/**
 * Full-bleed hero product plane with gentle 3D float + pointer tilt.
 * Respects prefers-reduced-motion (CSS disables animation / JS skips tilt).
 */
export function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) return
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        stage.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`)
        stage.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`)
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      stage.style.setProperty('--tilt-x', '0deg')
      stage.style.setProperty('--tilt-y', '0deg')
    }

    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={stageRef} className="hero-stage" aria-hidden="true">
      <div className="hero-stage-depth" />
      <div className="hero-stage-plane">
        <img
          className="hero-devices"
          src="/hero-devices.jpg"
          alt=""
          width={960}
          height={540}
          decoding="async"
        />
      </div>
    </div>
  )
}
