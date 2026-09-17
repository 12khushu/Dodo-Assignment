import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const TAU = Math.PI * 2

const palettes = [
  { name: 'Solar', colors: ['#ffb45b', '#ff6f61', '#f5e6a8'] },
  { name: 'Mint', colors: ['#8df5d2', '#63c7ff', '#d8ffe9'] },
  { name: 'Violet', colors: ['#c49cff', '#7e7cff', '#f0d4ff'] },
  { name: 'Ice', colors: ['#a8e8ff', '#ffffff', '#8bb7ff'] },
  { name: 'Ocean', colors: ['#4cc9f0', '#4361ee', '#b8f2ff'] },
  { name: 'Coral', colors: ['#ff8a80', '#ff5252', '#ffd6d2'] },
  { name: 'Sunset', colors: ['#ff9a62', '#ff5f6d', '#ffd3a5'] },
  { name: 'Forest', colors: ['#6ee7a8', '#2f9e74', '#d7f9e3'] },
  { name: 'Rose', colors: ['#ff9ec4', '#e85aad', '#ffe1ee'] },
  { name: 'Sky', colors: ['#7dd3fc', '#38bdf8', '#dff6ff'] },
  { name: 'Lavender', colors: ['#b9a0ff', '#8b5cf6', '#eadcff'] },
  { name: 'Peach', colors: ['#ffb38a', '#ff8066', '#ffe0cc'] },
  { name: 'Lemon', colors: ['#ffe66d', '#f7c948', '#fff7bf'] },
  { name: 'Aqua', colors: ['#67e8f9', '#06b6d4', '#d9fbff'] },
  { name: 'Berry', colors: ['#f472b6', '#c026d3', '#fce7f3'] },
  { name: 'Ember', colors: ['#ff7849', '#ef4444', '#ffd1c2'] },
  { name: 'Meadow', colors: ['#86efac', '#22c55e', '#dcfce7'] },
  { name: 'Plum', colors: ['#d8b4fe', '#9333ea', '#f3e8ff'] },
  { name: 'Midnight', colors: ['#93c5fd', '#4f46e5', '#dbeafe'] },
  { name: 'Candy', colors: ['#f9a8d4', '#fb7185', '#fce7f3'] }
];

function App() {
  const canvasRef = useRef(null)
  const settingsRef = useRef({ palette: 0, energy: 0.55, chaos: 0.35, paused: false, seed: Math.random() * 1000 })
  const [palette, setPalette] = useState(0)
  const [energy, setEnergy] = useState(55)
  const [chaos, setChaos] = useState(35)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    settingsRef.current.palette = palette
    settingsRef.current.energy = energy / 100
    settingsRef.current.chaos = chaos / 100
  }, [palette, energy, chaos])

  useEffect(() => {
    settingsRef.current.paused = paused
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    let raf = 0
    let width = 0, height = 0, dpr = 1
    const pointer = { x: 0.5, y: 0.5, active: false }
    const particles = []
    const pulses = []
    const stars = []
    let last = performance.now()
    let time = 0

    const random = (amount = 1) => Math.random() * amount
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, Math.floor(rect.width * dpr))
      height = Math.max(1, Math.floor(rect.height * dpr))
      canvas.width = width
      canvas.height = height
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      width = rect.width
      height = rect.height
      buildField()
    }

    const buildField = () => {
      particles.length = 0
      stars.length = 0
      const count = Math.min(1100, Math.max(420, Math.floor(width * height / 1350)))
      for (let i = 0; i < count; i++) {
        const a = random(TAU)
        const r = Math.sqrt(random())
        particles.push({
          x: width / 2 + Math.cos(a) * r * width * 0.48,
          y: height / 2 + Math.sin(a) * r * height * 0.52,
          px: 0, py: 0,
          vx: random(0.4) - 0.2,
          vy: random(0.4) - 0.2,
          size: 0.55 + random(1.8),
          phase: random(TAU),
          life: random(1)
        })
      }
      for (let i = 0; i < 150; i++) stars.push({ x: random(width), y: random(height), r: random(1.3), a: 0.08 + random(0.25) })
    }

    const pointerMove = (e) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = (e.clientX - r?.left) / r.width
      pointer.y = (e.clientY - r.top) / r.height
      pointer.active = true
    }
    const pointerLeave = () => { pointer.active = false }
    const pointerDown = (e) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = (e.clientX - r?.left) / r.width
      pointer.y = (e.clientY - r.top) / r.height
      pulses.push({ x: pointer.x * width, y: pointer.y * height, r: 2, life: 1 })
    }
        const onKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        settingsRef.current.paused = !settingsRef.current.paused
        setPaused(settingsRef.current.paused)
      }
      if (e.key.toLowerCase() === 'r') {
        settingsRef.current.seed = Math.random() * 1000
        buildField()
      }
    }

    canvas.addEventListener('pointermove', pointerMove)
    canvas.addEventListener('pointerleave', pointerLeave)
    canvas.addEventListener('pointerdown', pointerDown)
        window.addEventListener('keydown', onKey)
    window.addEventListener('resize', resize)
    resize()

    const draw = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      const s = settingsRef.current
      if (!s.paused) time += dt

      const p = palettes[s.palette]
      const bg = ctx.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.78)
      bg.addColorStop(0, '#16151c')
      bg.addColorStop(0.48, '#0b0b10')
      bg.addColorStop(1, '#050507')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      for (const st of stars) {
        ctx.globalAlpha = st.a * (0.65 + Math.sin(time * 0.7 + st.x) * 0.35)
        ctx.fillStyle = p.colors[2]
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, TAU); ctx.fill()
      }
      ctx.globalAlpha = 1

      const mx = pointer.x * width, my = pointer.y * height
      for (const particle of particles) {
        particle.px = particle.x
        particle.py = particle.y
        if (!s.paused) {
          const dx = particle.x - mx
          const dy = particle.y - my
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001
          const influence = pointer.active ? Math.max(0, 1 - dist / (Math.min(width, height) * 0.55)) : 0
          const angle = Math.atan2(dy, dx) + Math.sin(time * 0.8 + particle.phase) * (0.8 + s.chaos * 2.2)
          const flow = 0.08 + s.energy * 0.24
          particle.vx += Math.cos(angle + Math.PI / 2) * influence * flow * dt * 60
          particle.vy += Math.sin(angle + Math.PI / 2) * influence * flow * dt * 60
          particle.vx += Math.sin(particle.y * 0.008 + time + particle.phase) * s.chaos * 0.012
          particle.vy += Math.cos(particle.x * 0.007 - time * 0.7 + particle.phase) * s.chaos * 0.012
          particle.vx *= 0.985
          particle.vy *= 0.985
          particle.x += particle.vx * (0.7 + s.energy * 2.0)
          particle.y += particle.vy * (0.7 + s.energy * 2.0)
          if (particle.x < -20) particle.x = width + 20
          if (particle.x > width + 20) particle.x = -20
          if (particle.y < -20) particle.y = height + 20
          if (particle.y > height + 20) particle.y = -20
        }

        const shimmer = 0.5 + 0.5 * Math.sin(time * 2.4 + particle.phase)
        const idx = Math.floor((particle.phase / TAU) * p.colors.length) % p.colors.length
        ctx.globalAlpha = 0.18 + shimmer * 0.55
        ctx.fillStyle = p.colors[idx]
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * (0.7 + shimmer * 0.5), 0, TAU)
        ctx.fill()
        if (pointer.active && Math.hypot(particle.x - mx, particle.y - my) < 65) {
          ctx.globalAlpha = 0.15
          ctx.strokeStyle = p.colors[2]
          ctx.lineWidth = 0.7
          ctx.beginPath(); ctx.moveTo(particle.x, particle.y); ctx.lineTo(mx, my); ctx.stroke()
        }
      }
      ctx.globalAlpha = 1

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i]
        if (!s.paused) { pulse.r += dt * (220 + s.energy * 180); pulse.life -= dt * 0.7 }
        ctx.globalAlpha = Math.max(0, pulse.life) * 0.55
        ctx.strokeStyle = p.colors[1]
        ctx.lineWidth = 1.5 + pulse.life * 2
        ctx.beginPath(); ctx.arc(pulse.x, pulse.y, pulse.r, 0, TAU); ctx.stroke()
        ctx.globalAlpha = Math.max(0, pulse.life) * 0.12
        ctx.fillStyle = p.colors[0]
        ctx.beginPath(); ctx.arc(pulse.x, pulse.y, pulse.r, 0, TAU); ctx.fill()
        if (pulse.life <= 0) pulses.splice(i, 1)
      }
      ctx.globalAlpha = 1

      if (pointer.active) {
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 120)
        glow.addColorStop(0, p.colors[1] + '20')
        glow.addColorStop(1, p.colors[1] + '00')
        ctx.fillStyle = glow; ctx.fillRect(mx - 120, my - 120, 240, 240)
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointermove', pointerMove)
      canvas.removeEventListener('pointerleave', pointerLeave)
      canvas.removeEventListener('pointerdown', pointerDown)
            window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const randomize = () => {
    setPalette(Math.floor(Math.random() * palettes.length))
    setEnergy(35 + Math.floor(Math.random() * 60))
    setChaos(10 + Math.floor(Math.random() * 80))
    settingsRef.current.seed = Math.random() * 1000
  }

  return (
    <main className="app">
      <canvas ref={canvasRef} className="canvas" aria-label="Interactive particle visualizer" />
      <div className="noise" />
      <header className="topbar">
        <div className="brand"><span className="dot" /> SIGNAL GARDEN</div>
        <div className="eyebrow">TINY VISUAL TOY.</div>
      </header>

      <section className="hero" aria-live="polite">
        <p className="kicker">MOVE / CLICK / PLAY</p>
        <h1>Shape the <em>signal.</em></h1>
        <p className="lede">A small particle field that follows your cursor. Move through it, give it a little energy, then click to send a ripple across the field.</p>
      </section>

      <section className="controls" aria-label="Visual controls">
        <div className="control-head">
          <span>FIELD SETTINGS</span>
          <button className="reset" onClick={randomize}>Randomize ↗</button>
        </div>
        <label>Palette <span>{palettes[palette].name}</span>
          <input type="range" min="0" max="3" step="1" value={palette} onChange={e => setPalette(Number(e.target.value))} />
        </label>
        <label>Energy <span>{energy}%</span>
          <input type="range" min="10" max="100" value={energy} onChange={e => setEnergy(Number(e.target.value))} />
        </label>
        <label>Chaos <span>{chaos}%</span>
          <input type="range" min="0" max="100" value={chaos} onChange={e => setChaos(Number(e.target.value))} />
        </label>
        <button className="pause" onClick={() => setPaused(v => !v)}>{paused ? 'Resume field' : 'Pause field'} <span>{paused ? '▶' : 'Ⅱ'}</span></button>
      </section>

      <aside className="tip-card" aria-label="Interaction hint">
        <div className="tip-mark">*</div>
        <div>
          <span className="tip-label">TRY THIS</span>
          <p>Move slowly, then click once. The field will carry the ripple outward.</p>
        </div>
      </aside>

      <aside className="detail-card" aria-label="Small interaction note">
        <div className="detail-line"><span className="detail-index">01</span><span>POINTER</span><span className="detail-value">FLOW</span></div>
        <div className="detail-line"><span className="detail-index">02</span><span>CLICK</span><span className="detail-value">RIPPLE</span></div>
        <div className="detail-line"><span className="detail-index">03</span><span>SPACE</span><span className="detail-value">PAUSE</span></div>
      </aside>

      <footer className="footer">
        <span>SPACE pause · R regenerate</span>
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
