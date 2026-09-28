import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import vertexShader from '../shaders/lavaVertex.glsl?raw'
import fragmentShader from '../shaders/lavaFragment.glsl?raw'
import { hexToRgb, INTRO } from '../introConfig'

function isLowPower() {
  const cores = navigator.hardwareConcurrency || 8
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const mobile = window.matchMedia('(max-width: 900px)').matches
  const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  return cores <= 4 || mobile || saveData || (memory !== undefined && memory <= 4)
}

export default function LavaBackground({ variant = 'hero' }: { variant?: 'hero' | 'footer' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const low = isLowPower()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !low,
      alpha: false,
      powerPreference: low ? 'low-power' : 'default',
    })
    renderer.setClearColor(INTRO.colors.black)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, low ? 1 : 1.5))

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const uniforms = {
      uTime: { value: 0 },
      uQuality: { value: low ? 3 : 5 },
      uBrightness: { value: INTRO.brightness },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uElectric: { value: new THREE.Vector3(...hexToRgb(INTRO.colors.electric)) },
      uNavy: { value: new THREE.Vector3(...hexToRgb(INTRO.colors.navy)) },
      uViolet: { value: new THREE.Vector3(...hexToRgb(INTRO.colors.violet)) },
      uRingRadius: { value: 0.34 },
      uCircle: { value: variant === 'footer' ? 1 : 0 },
    }
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)

    let frame = 0
    let visible = document.visibilityState === 'visible'
    let start = performance.now()

    const resize = () => {
      const parent = canvas.parentElement
      const width = parent?.clientWidth || window.innerWidth
      const height = parent?.clientHeight || window.innerHeight
      const scale = low ? 0.55 : 1
      renderer.setSize(Math.floor(width * scale), Math.floor(height * scale), false)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      uniforms.uResolution.value.set(width, height)
      if (variant === 'footer') {
        const ring = Math.min(height * 0.72, width * 0.18, 220)
        uniforms.uRingRadius.value = ring / (2 * Math.max(height, 1))
      } else {
        const ring = Math.min(window.innerHeight * 0.78, 880)
        uniforms.uRingRadius.value = ring / (2 * Math.max(height, 1))
      }
    }

    const tick = (now: number) => {
      if (!visible) return
      uniforms.uTime.value = reduced ? 0 : (now - start) / 1000
      renderer.render(scene, camera)
      frame = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible) {
        start = performance.now() - uniforms.uTime.value * 1000
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(frame)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      material.dispose()
      mesh.geometry.dispose()
      renderer.dispose()
    }
  }, [variant])

  return <canvas className="lava-canvas" ref={canvasRef} aria-hidden="true" />
}
