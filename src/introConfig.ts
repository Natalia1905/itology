/**
 * Ajustes de la introducción y del fondo.
 *
 * Duración (segundos, máximo ~4 s en total):
 *   blackHold        0.0–0.3  pantalla negra
 *   ringDuration     0.3–1.3  la O se dibuja en 2D (punto → 360°)
 *   lettersDuration  1.3–2.2  entran IT y LOGY
 *   assembledHold    2.0–2.5  logo formado
 *   flipDuration     2.5–3.3  vuelo a la cabecera
 *   revealDuration   2.9–3.7  menú y texto del inicio
 *
 * spinSpeed   reservado; la O ahora se dibuja en 2D (usa ringDuration)
 * brightness  brillo del aro y del fondo lava (1 = base)
 * colors      paleta del shader y del anillo
 */
export const INTRO = {
  blackHold: 0.3,
  ringDuration: 1.0,
  lettersDuration: 0.9,
  assembledHold: 0.5,
  flipDuration: 0.8,
  revealDuration: 0.8,
  spinSpeed: 0.42,
  brightness: 1.15,
  colors: {
    electric: '#1a8cff',
    navy: '#071528',
    violet: '#0b5fbf',
    pink: '#6ec4ff',
    white: '#ffffff',
    black: '#000000',
  },
} as const

export const INTRO_STORAGE_KEY = 'itology-intro-played'

export function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.replace('#', ''), 16)
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255]
}
