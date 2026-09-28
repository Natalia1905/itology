export default function useIntroSession() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return {
    reduced,
    shouldPlay: true,
  }
}
