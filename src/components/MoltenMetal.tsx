'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface MoltenMetalProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  scale?: number;
  detail?: number;
  glow?: number;
  coreSize?: number;
  swirl?: number;
  fold?: number;
  blackPoint?: number;
  brightness?: number;
  colorMode?: string;
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uGlow;
  uniform float uSwirl;
  uniform float uFold;
  uniform float uBlackPoint;
  uniform float uBrightness;
  uniform float uGrainIntensity;
  uniform bool uGrain;
  uniform bool uMouseInteraction;
  uniform float uMouseStrength;
  uniform float uOpacity;

  varying vec2 vUv;

  // Simplex 2D noise helper
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Random hash for grain
  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  void main() {
    vec2 st = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
    
    vec2 mouseOffset = vec2(0.0);
    if (uMouseInteraction) {
      mouseOffset = (uMouse - 0.5) * uMouseStrength * 2.0;
    }

    st += mouseOffset;

    float t = uTime * uSpeed;
    vec2 p = st * uScale * 0.5;

    // Fluid distortion layers
    float n1 = snoise(p + vec2(t * 0.2, t * 0.3));
    float n2 = snoise(p * 1.5 - vec2(n1 * uSwirl, t * 0.4));
    float n3 = snoise(p * 2.0 + vec2(n2 * uFold, n1 * 0.5));

    float finalNoise = (n1 + n2 + n3) / 3.0;
    float v = smoothstep(uBlackPoint, 1.0, finalNoise + 0.5);

    // Molten color blending
    vec3 color = mix(uColor1, uColor2, v);
    color = mix(color, uColor3, smoothstep(0.4, 0.9, n2 * uGlow));
    color *= uBrightness;

    if (uGrain) {
      float grainVal = (rand(st + uTime) - 0.5) * uGrainIntensity;
      color += grainVal;
    }

    gl_FragColor = vec4(color, uOpacity);
  }
`;

export const MoltenMetal: React.FC<MoltenMetalProps> = ({
  color1 = '#5227FF',
  color2 = '#FF9FFC',
  color3 = '#FFFFFF',
  speed = 0.35,
  scale = 4,
  detail = 3,
  glow = 1.6,
  coreSize = 0.1,
  swirl = 1,
  fold = -0.2,
  blackPoint = 0.05,
  brightness = 1.3,
  colorMode = 'molten',
  grain = true,
  grainIntensity = 0.05,
  mouseInteraction = true,
  mouseStrength = 0.3,
  opacity = 1,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mousePos = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uColor3: { value: new THREE.Color(color3) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uGlow: { value: glow },
      uSwirl: { value: swirl },
      uFold: { value: fold },
      uBlackPoint: { value: blackPoint },
      uBrightness: { value: brightness },
      uGrainIntensity: { value: grainIntensity },
      uGrain: { value: grain },
      uMouseInteraction: { value: mouseInteraction },
      uMouseStrength: { value: mouseStrength },
      uOpacity: { value: opacity },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.set(mousePos.current.x, mousePos.current.y);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      };
    };

    window.addEventListener('resize', handleResize);
    if (mouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mouseInteraction) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Update uniforms when props change dynamically
  useEffect(() => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uColor1.value.set(color1);
    u.uColor2.value.set(color2);
    u.uColor3.value.set(color3);
    u.uSpeed.value = speed;
    u.uScale.value = scale;
    u.uGlow.value = glow;
    u.uSwirl.value = swirl;
    u.uFold.value = fold;
    u.uBlackPoint.value = blackPoint;
    u.uBrightness.value = brightness;
    u.uGrainIntensity.value = grainIntensity;
    u.uGrain.value = grain;
    u.uMouseInteraction.value = mouseInteraction;
    u.uMouseStrength.value = mouseStrength;
    u.uOpacity.value = opacity;
  }, [
    color1,
    color2,
    color3,
    speed,
    scale,
    glow,
    swirl,
    fold,
    blackPoint,
    brightness,
    grainIntensity,
    grain,
    mouseInteraction,
    mouseStrength,
    opacity,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={style}
    />
  );
};

export default MoltenMetal;
