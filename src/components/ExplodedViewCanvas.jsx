import { useRef, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import ExplodedAssembly, { PARTS } from './ExplodedAssembly.jsx'

// Bridges React slider state (0-100, re-renders) with a mutable ref the
// R3F render loop reads every frame (no re-render needed) -- this is what
// makes the explode motion buttery instead of chunky-on-state-change.
function ProgressDriver({ progressRef, targetRef }){
  useFrame(() => {
    progressRef.current += (targetRef.current - progressRef.current) * 0.08
  })
  return null
}

export default function ExplodedViewCanvas(){
  const [sliderValue, setSliderValue] = useState(0)
  const [animating, setAnimating] = useState(false)
  const progressRef = useRef(0)
  const targetRef = useRef(0)
  const rafRef = useRef(null)

  const setTarget = useCallback((val) => {
    targetRef.current = val
    setSliderValue(Math.round(val * 100))
  }, [])

  const handleSlider = (e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setAnimating(false)
    const v = Number(e.target.value) / 100
    setTarget(v)
  }

  const runAutoAnimation = (to) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setAnimating(true)
    setTarget(to)
    // stop the "animating" pulse indicator once close to target
    const check = () => {
      if (Math.abs(progressRef.current - to) < 0.01){
        setAnimating(false)
        return
      }
      rafRef.current = requestAnimationFrame(check)
    }
    rafRef.current = requestAnimationFrame(check)
  }

  return (
    <div className="explode-stage">
      <div className="explode-canvas-wrap">
        <Canvas shadows camera={{ position: [3.6, 2.4, 3.6], fov: 40 }} dpr={[1, 2]}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 6, 4]} intensity={1.3} castShadow />
          <directionalLight position={[-4, -1, -3]} intensity={0.35} color="#ff4b4b" />
          <ProgressDriver progressRef={progressRef} targetRef={targetRef} />
          <ExplodedAssembly progress={progressRef} />
          <ContactShadows position={[0, -1.2, 0]} opacity={0.45} scale={9} blur={2.6} far={2.4} />
          <Environment preset="warehouse" />
          <OrbitControls enablePan enableZoom enableRotate minDistance={3} maxDistance={10} makeDefault />
        </Canvas>
      </div>

      <div className="explode-controls">
        <button
          className="explode-btn"
          onClick={() => runAutoAnimation(sliderValue > 50 ? 0 : 1)}
        >
          {sliderValue > 50 ? 'REASSEMBLE' : 'EXPLODE VIEW'}
          <span>{animating ? '···' : '→'}</span>
        </button>

        <div className="explode-slider-row">
          <label className="mono">MANUAL SEPARATION — {sliderValue}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSlider}
          />
        </div>

        <p className="explode-readout mono">
          COMPONENTS: <b>{PARTS.length}</b><br />
          ASSEMBLY: <b>GEARBOX-HOUSING-V3</b><br />
          MATERIAL: <b>AL 6061-T6 / STEEL</b><br />
          STATUS: <b style={{ color: sliderValue > 5 ? '#ff4b4b' : '#2ea6ff' }}>
            {sliderValue > 5 ? 'EXPLODED' : 'ASSEMBLED'}
          </b>
        </p>
      </div>
    </div>
  )
}
