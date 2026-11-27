/**
 * Full-bleed hero product plane — quiet stage, no pointer tilt / float gimmicks.
 * Entrance fade is handled in CSS; respects prefers-reduced-motion.
 */
export function HeroStage() {
  return (
    <div className="hero-stage" aria-hidden="true">
      <div className="hero-stage-glow" />
      <img
        className="hero-devices"
        src="/hero-devices.jpg"
        alt=""
        width={960}
        height={540}
        decoding="async"
        fetchPriority="high"
      />
    </div>
  )
}
