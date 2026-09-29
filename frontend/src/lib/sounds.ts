import { Howl } from 'howler'

// All sounds are small inline audio blobs encoded as base64
// so the project works without any asset download
const SOUNDS: Record<string, Howl> = {}

function makeBeep(frequency: number, duration: number, type: OscillatorType = 'sine', vol = 0.4): Howl {
  const sampleRate = 44100
  const samples = Math.floor(sampleRate * duration)
  const buffer = new ArrayBuffer(44 + samples * 2)
  const view = new DataView(buffer)

  // WAV header
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + samples * 2, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeStr(36, 'data')
  view.setUint32(40, samples * 2, true)

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate
    let v = 0
    const envelope = Math.min(1, t / 0.01) * Math.max(0, 1 - (t - duration * 0.5) / (duration * 0.5))
    if (type === 'sine') v = Math.sin(2 * Math.PI * frequency * t)
    else if (type === 'square') v = Math.sign(Math.sin(2 * Math.PI * frequency * t))
    else v = 2 * (t * frequency % 1) - 1
    view.setInt16(44 + i * 2, Math.max(-32768, Math.min(32767, v * envelope * 32767 * vol)), true)
  }

  const blob = new Blob([buffer], { type: 'audio/wav' })
  const url = URL.createObjectURL(blob)
  return new Howl({ src: [url], format: ['wav'], volume: vol })
}

export function initSounds() {
  SOUNDS['snap']       = makeBeep(600,  0.06, 'sine',   0.3)
  SOUNDS['success']    = makeBeep(880,  0.15, 'sine',   0.4)
  SOUNDS['error']      = makeBeep(220,  0.25, 'square', 0.3)
  SOUNDS['connect']    = makeBeep(1046, 0.12, 'sine',   0.5)
  SOUNDS['disconnect'] = makeBeep(330,  0.18, 'sine',   0.3)
  SOUNDS['click']      = makeBeep(700,  0.05, 'sine',   0.2)
  SOUNDS['flash']      = makeBeep(440,  0.30, 'sine',   0.35)
  SOUNDS['pavi']       = makeBeep(900,  0.08, 'sine',   0.25)
}

let muted = false

export function setMuted(val: boolean) { muted = val }
export function isMuted() { return muted }

export function playSound(name: string) {
  if (muted) return
  if (SOUNDS[name]) SOUNDS[name].play()
}
