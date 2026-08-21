'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface GradientWavesProps {
  horizonColor?: string;
  waveColor?: string;
  crestColor?: string;
  speed?: number;
  amplitude?: number;
  waveScale?: number;
  waveRatio?: number;
  swell?: number;
  turbulence?: number;
  tilt?: number;
  zoom?: number;
  height?: number;
  fogDepth?: number;
  detail?: string;
  brightness?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  parallaxStrength?: number;
  grain?: boolean;
  grainIntensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const vertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uAmplitude;
  uniform float uWaveScale;
  uniform float uWaveRatio;
  uniform float uSwell;
  uniform float uTurbulence;

  varying vec2 vUv;
  varying float vElevation;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + vec4(ns.yyyy);
    vec4 y = y_ *ns.x + vec4(ns.yyyy);
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float t = uTime * uSpeed;
    vec2 p = uv * uWaveScale * 8.0;

    float wave1 = sin(p.x * uWaveRatio + t) * cos(p.y + t * 0.8) * uAmplitude;
    float wave2 = snoise(vec3(p * (uTurbulence * 0.05), t * 0.5)) * (uSwell * 0.1);

    float elevation = wave1 + wave2;
    pos.z += elevation;

    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uHorizonColor;
  uniform vec3 uWaveColor;
  uniform vec3 uCrestColor;
  uniform float uFogDepth;
  uniform float uBrightness;
  uniform float uOpacity;
  uniform bool uGrain;
  uniform float uGrainIntensity;
  uniform float uTime;

  varying vec2 vUv;
  varying float vElevation;

  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  void main() {
    float mixVal = smoothstep(-2.0, 3.0, vElevation);
    vec3 color = mix(uHorizonColor, uWaveColor, mixVal);

    float crestVal = smoothstep(1.5, 3.5, vElevation);
    color = mix(color, uCrestColor, crestVal);

    color *= uBrightness;

    if (uGrain) {
      float grainVal = (rand(vUv + uTime) - 0.5) * uGrainIntensity;
      color += grainVal;
    }

    gl_FragColor = vec4(color, uOpacity);
  }
`;

export const GradientWaves: React.FC<GradientWavesProps> = ({
  horizonColor = '#5227FF',
  waveColor = '#FF9FFC',
  crestColor = '#FFFFFF',
  speed = 0.4,
  amplitude = 2.5,
  waveScale = 0.6,
  waveRatio = 0.9,
  swell = 35,
  turbulence = 20,
  tilt = 1.11,
  zoom = 1,
  height = 5.5,
  fogDepth = 15,
  detail = 'medium',
  brightness = 1,
  opacity = 1,
  grain = true,
  grainIntensity = 0.05,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const heightPx = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, width / heightPx, 0.1, 1000);
    camera.position.set(0, -4, 8 / zoom);
    camera.rotation.x = tilt;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    const segments = detail === 'high' ? 128 : detail === 'medium' ? 96 : 64;
    // Giant plane size (200x200) to ensure zero edge clipping across any screen ratio
    const geometry = new THREE.PlaneGeometry(200, 200, segments, segments);

    const uniforms = {
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uAmplitude: { value: amplitude },
      uWaveScale: { value: waveScale },
      uWaveRatio: { value: waveRatio },
      uSwell: { value: swell },
      uTurbulence: { value: turbulence },
      uHorizonColor: { value: new THREE.Color(horizonColor) },
      uWaveColor: { value: new THREE.Color(waveColor) },
      uCrestColor: { value: new THREE.Color(crestColor) },
      uFogDepth: { value: fogDepth },
      uBrightness: { value: brightness },
      uOpacity: { value: opacity },
      uGrain: { value: grain },
      uGrainIntensity: { value: grainIntensity },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [detail]);

  useEffect(() => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uSpeed.value = speed;
    u.uAmplitude.value = amplitude;
    u.uWaveScale.value = waveScale;
    u.uWaveRatio.value = waveRatio;
    u.uSwell.value = swell;
    u.uTurbulence.value = turbulence;
    u.uHorizonColor.value.set(horizonColor);
    u.uWaveColor.value.set(waveColor);
    u.uCrestColor.value.set(crestColor);
    u.uFogDepth.value = fogDepth;
    u.uBrightness.value = brightness;
    u.uOpacity.value = opacity;
    u.uGrain.value = grain;
    u.uGrainIntensity.value = grainIntensity;
  }, [
    speed,
    amplitude,
    waveScale,
    waveRatio,
    swell,
    turbulence,
    horizonColor,
    waveColor,
    crestColor,
    fogDepth,
    brightness,
    opacity,
    grain,
    grainIntensity,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-screen relative overflow-hidden ${className}`}
      style={style}
    />
  );
};

export default GradientWaves;
