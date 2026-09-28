precision mediump float;

uniform float uTime;
uniform float uQuality;
uniform float uBrightness;
uniform vec2 uResolution;
uniform vec3 uElectric;
uniform vec3 uNavy;
uniform vec3 uViolet;
uniform float uRingRadius;
uniform float uCircle;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    if (float(i) >= uQuality) break;
    v += a * noise(p);
    p *= 2.04;
    a *= 0.5;
  }
  return v;
}

float distLine(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
  return length(pa - ba * h);
}

float alongLine(vec2 p, vec2 a, vec2 b) {
  vec2 ba = b - a;
  return clamp(dot(p - a, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
}

vec2 neuralNode(float i, float t, vec2 aspect) {
  float h = hash(vec2(i * 13.17, i * 7.73));
  float h2 = hash(vec2(i * 3.31, 19.21));
  float h3 = hash(vec2(i, 4.41));
  float dir = h > 0.5 ? 1.0 : -1.0;
  float speed = mix(0.028, 0.07, h2);
  float x = (fract(h + t * speed * dir) - 0.5) * aspect.x;
  float y = (h3 - 0.5) * 0.92 + sin(t * mix(0.22, 0.55, h) + h2 * 6.28318) * 0.07;
  return vec2(x, y);
}

float nodePulse(float i, float t) {
  float ph = hash(vec2(i, 9.91)) * 6.28318;
  float speed = mix(0.35, 0.9, hash(vec2(i, 11.4)));
  return 0.35 + 0.65 * smoothstep(0.15, 0.7, 0.5 + 0.5 * sin(t * speed + ph));
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 p = (uv - 0.5) * aspect;
  float t = uTime * 0.13;
  float n = fbm(p * 1.55 + vec2(t * 0.28, -t * 0.18));
  float m = fbm(p * 2.6 - vec2(t * 0.14, t * 0.24) + n);
  float gaps = fbm(p * 0.68 + vec2(-t * 0.08, t * 0.06));

  float lower = uCircle > 0.5 ? 0.0 : (1.0 - smoothstep(0.2, 0.56, uv.y));
  float open = mix(smoothstep(0.22, 0.56, gaps), 1.0, lower);
  float density = smoothstep(0.26, 0.6, n) * open;
  density *= mix(0.7, 1.0, smoothstep(0.22, 0.66, m));
  density = mix(density, mix(0.62, 1.0, n * 0.55 + m * 0.45), lower);

  vec3 col = mix(vec3(0.0), uNavy, density);
  col = mix(col, uElectric, smoothstep(0.18, 0.68, m) * density * 0.95);
  col = mix(col, uViolet, smoothstep(0.28, 0.76, n) * density * 0.7);
  col += uElectric * density * m * 0.55;
  col += uViolet * density * n * 0.18;
  col *= uBrightness * 0.95;

  float spread = 1.0 - smoothstep(0.95, 1.5, length(p * vec2(0.48, 0.62)));
  col *= mix(0.22 + 0.78 * spread, 1.0, lower);

  if (uCircle > 0.5) {
    float radius = max(uRingRadius, 0.22);
    float blob = length(p);
    col *= smoothstep(radius * 0.98, radius * 0.38, blob);
  }

  if (uCircle < 0.5) {
    float now = uTime * 0.22;
    float net = 0.0;
    float dots = 0.0;
    float pulses = 0.0;
    for (int i = 0; i < 16; i++) {
      float fi = float(i);
      vec2 a = neuralNode(fi, now, aspect);
      vec2 b = neuralNode(mod(fi + 1.0, 16.0), now, aspect);
      vec2 c = neuralNode(mod(fi + 3.0, 16.0), now, aspect);
      float fade = nodePulse(fi, now) * nodePulse(fi + 2.4, now + 0.5);
      float d1 = distance(a, b);
      float d2 = distance(a, c);
      float link = fade * (1.0 - smoothstep(0.22, 0.42, d1));
      float link2 = fade * 0.7 * (1.0 - smoothstep(0.2, 0.38, d2));
      net += link * (1.0 - smoothstep(0.0, 0.00105, distLine(p, a, b)));
      net += link2 * (1.0 - smoothstep(0.0, 0.00085, distLine(p, a, c)));
      float travel = fract(alongLine(p, a, b) - now * 0.55 + hash(vec2(fi, 2.2)));
      pulses += link * (1.0 - smoothstep(0.0, 0.0014, distLine(p, a, b))) * smoothstep(0.12, 0.0, abs(travel - 0.5));
      dots += nodePulse(fi, now + 0.7) * (1.0 - smoothstep(0.0, 0.0026, length(p - a)));
    }
    float titleBand = 1.0 - smoothstep(0.05, 0.12, abs(p.y + 0.02));
    float field = 1.0 - titleBand * 0.4;
    vec3 neural = uElectric * net * 0.55 + vec3(0.88, 0.92, 1.0) * dots * 0.7;
    neural += uElectric * pulses * 0.85;
    neural += uViolet * net * 0.16;
    col += neural * field;
  }

  gl_FragColor = vec4(col, 1.0);
}
