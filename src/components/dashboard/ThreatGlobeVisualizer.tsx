import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CyberPanel, ViewContainer, SectionTitle } from '../ui/common';
import {
  Globe,
  Radio,
  Zap,
  Shield,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Flame,
  Activity,
  Server,
  Crosshair,
  Lock,
  Compass,
  Gauge,
} from 'lucide-react';
import { soundService } from '../../services/soundService';

// --- Types ---
interface ThreatCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  ip: string;
  region: string;
  status: 'HIGH_RISK_ORIGIN' | 'TARGET_DATACENTER' | 'MONITORED_GATEWAY';
}

interface AttackTrajectory {
  id: string;
  name: string;
  type: string;
  mitreTechnique: string;
  cve: string;
  sourceCity: ThreatCity;
  targetCity: ThreatCity;
  bandwidth: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'ACTIVE' | 'BLOCKED' | 'MITIGATING';
  color: string;
  timestamp: string;
}

// --- Geographic Threat Hubs ---
const THREAT_CITIES: ThreatCity[] = [
  { id: 'was', name: 'Washington D.C.', country: 'United States', lat: 38.9072, lng: -77.0369, ip: '198.51.100.42', region: 'North America', status: 'TARGET_DATACENTER' },
  { id: 'nyc', name: 'New York (AWS East)', country: 'United States', lat: 40.7128, lng: -74.0060, ip: '52.94.76.1', region: 'North America', status: 'TARGET_DATACENTER' },
  { id: 'sfo', name: 'San Francisco (Silicon Valley)', country: 'United States', lat: 37.7749, lng: -122.4194, ip: '199.16.156.6', region: 'North America', status: 'TARGET_DATACENTER' },
  { id: 'lon', name: 'London (Azure UK)', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, ip: '51.140.0.12', region: 'Europe', status: 'TARGET_DATACENTER' },
  { id: 'fra', name: 'Frankfurt (Equinix DC)', country: 'Germany', lat: 50.1109, lng: 8.6821, ip: '194.12.1.88', region: 'Europe', status: 'TARGET_DATACENTER' },
  { id: 'mos', name: 'Moscow (AS4134)', country: 'Russia', lat: 55.7558, lng: 37.6173, ip: '95.173.136.2', region: 'Eurasia', status: 'HIGH_RISK_ORIGIN' },
  { id: 'bei', name: 'Beijing (AS9808)', country: 'China', lat: 39.9042, lng: 116.4074, ip: '202.108.22.5', region: 'Asia Pacific', status: 'HIGH_RISK_ORIGIN' },
  { id: 'tok', name: 'Tokyo (GCP Asia-East)', country: 'Japan', lat: 35.6762, lng: 139.6503, ip: '35.200.0.1', region: 'Asia Pacific', status: 'TARGET_DATACENTER' },
  { id: 'seo', name: 'Seoul (KT Datacenter)', country: 'South Korea', lat: 37.5665, lng: 126.9780, ip: '211.233.5.1', region: 'Asia Pacific', status: 'TARGET_DATACENTER' },
  { id: 'pyo', name: 'Pyongyang (AS131279)', country: 'North Korea', lat: 39.0392, lng: 125.7625, ip: '175.45.176.3', region: 'Asia Pacific', status: 'HIGH_RISK_ORIGIN' },
  { id: 'teh', name: 'Tehran (TIC Gateway)', country: 'Iran', lat: 35.6892, lng: 51.3890, ip: '5.160.20.9', region: 'Middle East', status: 'HIGH_RISK_ORIGIN' },
  { id: 'dxb', name: 'Dubai (Oracle Cloud)', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, ip: '140.238.0.1', region: 'Middle East', status: 'MONITORED_GATEWAY' },
  { id: 'del', name: 'New Delhi (NIC Cloud)', country: 'India', lat: 28.6139, lng: 77.2090, ip: '164.100.1.5', region: 'South Asia', status: 'MONITORED_GATEWAY' },
  { id: 'sin', name: 'Singapore (Singtel Tier 4)', country: 'Singapore', lat: 1.3521, lng: 103.8198, ip: '165.21.0.8', region: 'Asia Pacific', status: 'TARGET_DATACENTER' },
  { id: 'syd', name: 'Sydney (AWS AP-Southeast)', country: 'Australia', lat: -33.8688, lng: 151.2093, ip: '13.54.0.1', region: 'Oceania', status: 'TARGET_DATACENTER' },
  { id: 'sao', name: 'São Paulo (Embratel DC)', country: 'Brazil', lat: -23.5505, lng: -46.6333, ip: '200.160.2.3', region: 'South America', status: 'TARGET_DATACENTER' },
  { id: 'jnb', name: 'Johannesburg (Teraco DBX)', country: 'South Africa', lat: -26.2041, lng: 28.0473, ip: '197.80.0.1', region: 'Africa', status: 'MONITORED_GATEWAY' },
];

// Initial Trajectories
const INITIAL_TRAJECTORIES: AttackTrajectory[] = [
  {
    id: 'TRJ-9041',
    name: 'Cobalt Strike C2 Beaconing',
    type: 'Command & Control / Exfiltration',
    mitreTechnique: 'T1071.001 (Web Protocols)',
    cve: 'CVE-2024-21413',
    sourceCity: THREAT_CITIES.find(c => c.id === 'mos')!,
    targetCity: THREAT_CITIES.find(c => c.id === 'was')!,
    bandwidth: '48.2 MB/s',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    color: '#ff0054',
    timestamp: 'Just now',
  },
  {
    id: 'TRJ-8822',
    name: 'Lazarus Swift Ransomware Probe',
    type: 'Financial Infrastructure Intrusion',
    mitreTechnique: 'T1486 (Data Encrypted for Impact)',
    cve: 'CVE-2023-38831',
    sourceCity: THREAT_CITIES.find(c => c.id === 'pyo')!,
    targetCity: THREAT_CITIES.find(c => c.id === 'tok')!,
    bandwidth: '124.5 Gbps',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    color: '#ff0054',
    timestamp: '12s ago',
  },
  {
    id: 'TRJ-7419',
    name: 'APT41 Distributed SQLi Injection',
    type: 'Web Application Exploit',
    mitreTechnique: 'T1190 (Exploit Public-Facing App)',
    cve: 'CVE-2024-3400',
    sourceCity: THREAT_CITIES.find(c => c.id === 'bei')!,
    targetCity: THREAT_CITIES.find(c => c.id === 'fra')!,
    bandwidth: '18.4 Gbps',
    severity: 'HIGH',
    status: 'ACTIVE',
    color: '#ffbe0b',
    timestamp: '28s ago',
  },
  {
    id: 'TRJ-6105',
    name: 'Mirai Botnet DNS Amplification',
    type: 'Volumetric DDoS Attack',
    mitreTechnique: 'T1498 (Network Denial of Service)',
    cve: 'CVE-2022-30525',
    sourceCity: THREAT_CITIES.find(c => c.id === 'teh')!,
    targetCity: THREAT_CITIES.find(c => c.id === 'lon')!,
    bandwidth: '380 Gbps',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    color: '#ff0054',
    timestamp: '45s ago',
  },
  {
    id: 'TRJ-5310',
    name: 'ShadowPad Zero-Day Privilege Escalation',
    type: 'Kernel Exploit Probe',
    mitreTechnique: 'T1068 (Privilege Escalation)',
    cve: 'CVE-2024-3094',
    sourceCity: THREAT_CITIES.find(c => c.id === 'bei')!,
    targetCity: THREAT_CITIES.find(c => c.id === 'sin')!,
    bandwidth: '5.2 MB/s',
    severity: 'MEDIUM',
    status: 'ACTIVE',
    color: '#00f0ff',
    timestamp: '1m ago',
  },
];

// Helper: Convert Lat/Lng to 3D Sphere Coordinates
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Generate Realistic Continents Point Matrix
function generateContinentPoints(radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  
  // Continent bounding zones [minLat, maxLat, minLng, maxLng, density]
  const continentBounds = [
    // North America
    { minLat: 15, maxLat: 70, minLng: -165, maxLng: -55, density: 0.35 },
    // South America
    { minLat: -55, maxLat: 12, minLng: -80, maxLng: -35, density: 0.3 },
    // Europe
    { minLat: 35, maxLat: 70, minLng: -10, maxLng: 40, density: 0.4 },
    // Africa
    { minLat: -35, maxLat: 37, minLng: -18, maxLng: 52, density: 0.32 },
    // Asia
    { minLat: 5, maxLat: 75, minLng: 40, maxLng: 145, density: 0.38 },
    // Australia & Oceania
    { minLat: -45, maxLat: -10, minLng: 110, maxLng: 178, density: 0.28 },
    // Japan / SE Asia Islands
    { minLat: -10, maxLat: 45, minLng: 95, maxLng: 145, density: 0.3 },
  ];

  const totalPoints = 3200;
  for (let i = 0; i < totalPoints; i++) {
    // Pick random continent box
    const zone = continentBounds[Math.floor(Math.random() * continentBounds.length)];
    const lat = zone.minLat + Math.random() * (zone.maxLat - zone.minLat);
    const lng = zone.minLng + Math.random() * (zone.maxLng - zone.minLng);
    
    // Add jitter
    points.push(latLngToVector3(lat, lng, radius));
  }

  // Add subtle background grid points across globe
  for (let lat = -80; lat <= 80; lat += 20) {
    for (let lng = -180; lng <= 180; lng += 20) {
      if (Math.random() > 0.4) {
        points.push(latLngToVector3(lat, lng, radius));
      }
    }
  }

  return points;
}

export default function ThreatGlobeVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trajectories, setTrajectories] = useState<AttackTrajectory[]>(INITIAL_TRAJECTORIES);
  const [selectedTrajectory, setSelectedTrajectory] = useState<AttackTrajectory>(INITIAL_TRAJECTORIES[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.003);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [theme, setTheme] = useState<'HOLO' | 'MATRIX' | 'SOLAR' | 'ICE'>('HOLO');
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [totalIntercepts, setTotalIntercepts] = useState(1482);
  const [liveBandwidth, setLiveBandwidth] = useState('571.4 Gbps');

  // Theme color palette
  const themeColors = useMemo(() => {
    switch (theme) {
      case 'MATRIX':
        return {
          primary: '#00ff88',
          secondary: '#00aa55',
          core: '#031a0e',
          arcSource: '#ff0054',
          arcTarget: '#00ff88',
          atmosphere: '#00ff88',
        };
      case 'SOLAR':
        return {
          primary: '#ffbe0b',
          secondary: '#ff006e',
          core: '#1f0d03',
          arcSource: '#ff0054',
          arcTarget: '#ffbe0b',
          atmosphere: '#ff7700',
        };
      case 'ICE':
        return {
          primary: '#00d4ff',
          secondary: '#ffffff',
          core: '#051329',
          arcSource: '#ff006e',
          arcTarget: '#00d4ff',
          atmosphere: '#00f0ff',
        };
      case 'HOLO':
      default:
        return {
          primary: '#00f0ff',
          secondary: '#7b2cbf',
          core: '#060912',
          arcSource: '#ff0054',
          arcTarget: '#00ff88',
          atmosphere: '#00f0ff',
        };
    }
  }, [theme]);

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 320);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 140;
    controls.maxDistance = 500;
    controls.autoRotate = isRotating;
    controls.autoRotateSpeed = rotationSpeed * 300;

    // 4. Globe Core Group
    const globeRadius = 100;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner Dark Hologram Sphere
    const innerSphereGeo = new THREE.SphereGeometry(globeRadius - 0.5, 48, 48);
    const innerSphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeColors.core),
      transparent: true,
      opacity: 0.9,
    });
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    globeGroup.add(innerSphere);

    // Latitude / Longitude Wireframe Grid
    const wireframeGeo = new THREE.SphereGeometry(globeRadius, 24, 24);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeColors.primary),
      wireframe: true,
      transparent: true,
      opacity: showGrid ? 0.08 : 0.0,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    globeGroup.add(wireframeMesh);

    // Continents Point Cloud
    const continentPoints = generateContinentPoints(globeRadius);
    const pointGeo = new THREE.BufferGeometry().setFromPoints(continentPoints);
    const pointMat = new THREE.PointsMaterial({
      color: new THREE.Color(themeColors.primary),
      size: 2.2,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const continentPointCloud = new THREE.Points(pointGeo, pointMat);
    globeGroup.add(continentPointCloud);

    // Glowing Outer Atmosphere Halo
    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.15, 32, 32);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(glowColor, intensity * 0.4);
        }
      `,
      uniforms: {
        glowColor: { value: new THREE.Color(themeColors.atmosphere) },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    atmosphereMesh.visible = showAtmosphere;
    scene.add(atmosphereMesh);

    // Orbital Defense Ring with Satellites
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = Math.PI / 6;
    orbitGroup.rotation.z = Math.PI / 8;
    scene.add(orbitGroup);

    const orbitRingGeo = new THREE.RingGeometry(globeRadius * 1.35, globeRadius * 1.37, 64);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeColors.primary),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: showOrbits ? 0.35 : 0.0,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2;
    orbitGroup.add(orbitRing);

    // Orbiting Defense Satellites
    const satelliteCount = 5;
    const satellites: THREE.Mesh[] = [];
    const satelliteGeo = new THREE.SphereGeometry(2, 12, 12);
    const satelliteMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(themeColors.primary),
    });
    for (let i = 0; i < satelliteCount; i++) {
      const sat = new THREE.Mesh(satelliteGeo, satelliteMat);
      orbitGroup.add(sat);
      satellites.push(sat);
    }

    // 5. City Hub Markers & Ground Beacons
    const cityMarkersGroup = new THREE.Group();
    globeGroup.add(cityMarkersGroup);

    const cityMeshMap = new Map<string, THREE.Vector3>();

    THREAT_CITIES.forEach((city) => {
      const pos = latLngToVector3(city.lat, city.lng, globeRadius);
      cityMeshMap.set(city.id, pos);

      // Base Node
      const isOrigin = city.status === 'HIGH_RISK_ORIGIN';
      const nodeColor = isOrigin ? '#ff0054' : '#00ff88';

      const nodeGeo = new THREE.SphereGeometry(1.8, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(nodeColor) });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      cityMarkersGroup.add(nodeMesh);

      // Vertical Cyber Beacon Beam
      const normal = pos.clone().normalize();
      const beamHeight = isOrigin ? 12 : 8;
      const beamGeo = new THREE.CylinderGeometry(0.3, 0.8, beamHeight, 8);
      beamGeo.translate(0, beamHeight / 2, 0);
      const beamMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeColor),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.copy(pos);
      beamMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      cityMarkersGroup.add(beamMesh);
    });

    // 6. Dynamic 3D Curved Attack Arcs & Flying Energy Photons
    const arcGroup = new THREE.Group();
    globeGroup.add(arcGroup);

    interface ActiveArcVisual {
      curve: THREE.QuadraticBezierCurve3;
      pulseMesh: THREE.Mesh;
      progress: number;
      speed: number;
    }

    const activeVisualArcs: ActiveArcVisual[] = [];

    const visibleTrajectories = trajectories.filter((t) => {
      if (severityFilter === 'ALL') return true;
      return t.severity === severityFilter;
    });

    visibleTrajectories.forEach((trj) => {
      const p1 = latLngToVector3(trj.sourceCity.lat, trj.sourceCity.lng, globeRadius);
      const p2 = latLngToVector3(trj.targetCity.lat, trj.targetCity.lng, globeRadius);

      // Calculate Arc Midpoint Altitude
      const distance = p1.distanceTo(p2);
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const altitude = globeRadius + Math.min(65, distance * 0.45);
      mid.normalize().multiplyScalar(altitude);

      // 3D Quadratic Spline
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      // Arc Line Material
      const arcMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(trj.color),
        transparent: true,
        opacity: selectedTrajectory.id === trj.id ? 0.9 : 0.45,
        linewidth: 2,
        blending: THREE.AdditiveBlending,
      });
      const lineMesh = new THREE.Line(arcGeo, arcMat);
      arcGroup.add(lineMesh);

      // Energy Pulse Photon traveling on Arc
      const pulseGeo = new THREE.SphereGeometry(1.6, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(trj.color),
        blending: THREE.AdditiveBlending,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      arcGroup.add(pulseMesh);

      activeVisualArcs.push({
        curve,
        pulseMesh,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.008,
      });
    });

    // 7. Background Cyber Starfield
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 800;
      starPositions[i + 1] = (Math.random() - 0.5) * 800;
      starPositions[i + 2] = (Math.random() - 0.5) * 800;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 1.2,
      transparent: true,
      opacity: 0.35,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 8. Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Controls Auto Rotate
      controls.autoRotate = isRotating;
      controls.autoRotateSpeed = rotationSpeed * 300;
      controls.update();

      // Animate Orbiting Satellites
      satellites.forEach((sat, idx) => {
        const angle = elapsedTime * 0.8 + (idx * Math.PI * 2) / satelliteCount;
        const r = globeRadius * 1.36;
        sat.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      });

      // Animate Energy Arcs Photons
      activeVisualArcs.forEach((v) => {
        v.progress += v.speed;
        if (v.progress > 1) v.progress = 0;
        const currentPos = v.curve.getPointAt(v.progress);
        v.pulseMesh.position.copy(currentPos);
      });

      // Subtle pulse to continent points
      continentPointCloud.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      innerSphereGeo.dispose();
      innerSphereMat.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      pointGeo.dispose();
      pointMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      orbitRingGeo.dispose();
      orbitRingMat.dispose();
      satelliteGeo.dispose();
      satelliteMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    isRotating,
    rotationSpeed,
    trajectories,
    severityFilter,
    themeColors,
    showAtmosphere,
    showOrbits,
    showGrid,
    selectedTrajectory.id,
  ]);

  // Inject Simulated Live Threat Trajectory
  const handleSimulateAttack = () => {
    soundService.playAlertAlarm();
    const origins = THREAT_CITIES.filter((c) => c.status === 'HIGH_RISK_ORIGIN');
    const targets = THREAT_CITIES.filter((c) => c.status === 'TARGET_DATACENTER');

    const randomOrigin = origins[Math.floor(Math.random() * origins.length)];
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];

    const attackNames = [
      { name: 'Volt Typhoon Zero-Day Exploit', type: 'Infrastructure Espionage', mitre: 'T1190', cve: 'CVE-2024-40766', sev: 'CRITICAL', color: '#ff0054' },
      { name: 'LockBit 3.0 AES-256 Encryption Wave', type: 'Enterprise Ransomware', mitre: 'T1486', cve: 'CVE-2023-27532', sev: 'CRITICAL', color: '#ff0054' },
      { name: 'SYN-Ack Volumetric Spike (420 Gbps)', type: 'Layer 4 DDoS Flood', mitre: 'T1498', cve: 'N/A', sev: 'HIGH', color: '#ffbe0b' },
      { name: 'SSH Brute Force Credential Stuffing', type: 'Identity Compromise', mitre: 'T1110', cve: 'CVE-2024-6387', sev: 'MEDIUM', color: '#00f0ff' },
    ];

    const pick = attackNames[Math.floor(Math.random() * attackNames.length)];
    const newId = `TRJ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBandwidth = (Math.random() * 350 + 20).toFixed(1);
    const newAttack: AttackTrajectory = {
      id: newId,
      name: pick.name,
      type: pick.type,
      mitreTechnique: pick.mitre,
      cve: pick.cve,
      sourceCity: randomOrigin,
      targetCity: randomTarget,
      bandwidth: `${newBandwidth} Gbps`,
      severity: pick.sev as any,
      status: 'ACTIVE',
      color: pick.color,
      timestamp: 'Just now',
    };

    setTrajectories((prev) => [newAttack, ...prev.slice(0, 7)]);
    setSelectedTrajectory(newAttack);
    setLiveBandwidth(`${(parseFloat(newBandwidth) + 480).toFixed(1)} Gbps`);
  };

  // Block Threat & Trigger SOC Intercept
  const handleBlockThreat = () => {
    soundService.playSuccessBeep();
    setTotalIntercepts((prev) => prev + 1);
    setTrajectories((prev) =>
      prev.map((t) => (t.id === selectedTrajectory.id ? { ...t, status: 'BLOCKED', color: '#00ff88' } : t))
    );
    setSelectedTrajectory((prev) => ({ ...prev, status: 'BLOCKED', color: '#00ff88' }));
  };

  return (
    <ViewContainer>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <SectionTitle
          title="Interactive 3D WebGL Threat Globe & Global Arc Visualizer"
          subtitle="Real-time three-dimensional cyber telemetry, orbital trajectory tracking, and automated firewall interception"
          icon={<Globe className="w-6 h-6 text-cyan-400" />}
        />

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Simulate Threat Wave */}
          <button
            onClick={handleSimulateAttack}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-purple-600 hover:brightness-110 text-white font-sans text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Simulate Live Attack</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-black/60 border border-cyan-500/20 rounded-xl p-1 text-xs">
            <Gauge className="w-3.5 h-3.5 text-cyan-400 ml-1.5" />
            {[
              { label: '0.5x', speed: 0.0015 },
              { label: '1x', speed: 0.003 },
              { label: '2x', speed: 0.006 },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => setRotationSpeed(s.speed)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  rotationSpeed === s.speed
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => {
              soundService.playSuccessBeep();
              setIsRotating(!isRotating);
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              isRotating
                ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                : 'bg-black/60 border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRotating ? 'Auto-Rotate ON' : 'Rotate Paused'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-black/60 border border-cyan-500/20 hover:border-cyan-400/40 text-cyan-400 transition-all cursor-pointer"
            title="Toggle Expanded View"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-cyber-dark/80 border border-cyan-500/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-medium">Active Trajectories</span>
            <p className="text-base font-display font-bold text-red-400">{trajectories.filter(t => t.status === 'ACTIVE').length} In-Flight</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-cyber-dark/80 border border-cyan-500/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-medium">Automated Intercepts</span>
            <p className="text-base font-display font-bold text-emerald-400">{totalIntercepts.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-cyber-dark/80 border border-cyan-500/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-medium">Aggregated Saturated Flow</span>
            <p className="text-base font-display font-bold text-amber-400">{liveBandwidth}</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-cyber-dark/80 border border-cyan-500/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-medium">3D Engine Rendering</span>
            <p className="text-base font-display font-bold text-cyan-300">WebGL 60 FPS</p>
          </div>
        </div>
      </div>

      {/* Main 3D WebGL Studio Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 ${isFullscreen ? 'fixed inset-4 z-50 bg-cyber-dark/95 backdrop-blur-2xl p-4 overflow-y-auto rounded-3xl border border-cyan-500/40 shadow-2xl' : ''}`}>
        
        {/* Left / Center 3D Canvas Panel */}
        <CyberPanel
          title="Global Attack Telemetry & 3D Orbital Trajectory Matrix"
          icon={<Globe className="w-4 h-4 text-cyan-400" />}
          className="lg:col-span-2 relative"
        >
          {/* Controls Overlay Bar */}
          <div className="p-3 bg-black/60 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Theme Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 uppercase font-medium">Holo Theme:</span>
              {(['HOLO', 'MATRIX', 'SOLAR', 'ICE'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold uppercase transition-all cursor-pointer ${
                    theme === t
                      ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-300'
                      : 'bg-black/40 border border-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 uppercase font-medium">Filter:</span>
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold uppercase transition-all cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-300'
                      : 'bg-black/40 border border-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-[10px] text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAtmosphere}
                  onChange={(e) => setShowAtmosphere(e.target.checked)}
                  className="rounded bg-black/80 border-cyan-500/40 text-cyan-400"
                />
                Halo
              </label>
              <label className="flex items-center gap-1 text-[10px] text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOrbits}
                  onChange={(e) => setShowOrbits(e.target.checked)}
                  className="rounded bg-black/80 border-cyan-500/40 text-cyan-400"
                />
                Orbit
              </label>
              <label className="flex items-center gap-1 text-[10px] text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="rounded bg-black/80 border-cyan-500/40 text-cyan-400"
                />
                Grid
              </label>
            </div>
          </div>

          {/* 3D WebGL Canvas Viewport */}
          <div className="relative h-[480px] w-full bg-gradient-to-b from-black/95 via-cyber-darker to-black/95 overflow-hidden">
            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* HUD Compass / Coordinate Widget */}
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-cyan-500/30 text-[11px] space-y-1 select-none pointer-events-none shadow-xl">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                <span>3D ORBITAL MATRIX</span>
              </div>
              <p className="text-gray-400 text-[10px]">
                DRAG to Rotate &bull; SCROLL to Zoom
              </p>
              <div className="pt-1 flex items-center gap-2 font-mono text-[10px]">
                <span className="text-emerald-400">&bull; ONLINE</span>
                <span className="text-gray-500">ZOOM: DYNAMIC</span>
              </div>
            </div>

            {/* Live Trajectory Quick Switcher Chips */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {trajectories.map((trj) => (
                <button
                  key={trj.id}
                  onClick={() => {
                    setSelectedTrajectory(trj);
                    soundService.playSuccessBeep();
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-sans font-medium whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                    selectedTrajectory.id === trj.id
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-black/75 border-gray-800 text-gray-300 hover:border-cyan-500/30'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: trj.color }}
                  />
                  <span>{trj.name}</span>
                  <span className="text-[9px] font-mono opacity-60">({trj.sourceCity.country.slice(0, 3)} &rarr; {trj.targetCity.country.slice(0, 3)})</span>
                </button>
              ))}
            </div>
          </div>
        </CyberPanel>

        {/* Right Inspector & Threat Detail Panel */}
        <CyberPanel
          title="Active Trajectory Forensics"
          icon={<Radio className="w-4 h-4 text-cyan-400" />}
        >
          <div className="p-4 space-y-4 text-xs font-sans">
            {/* Header Badge */}
            <div className="p-3 rounded-2xl bg-black/80 border border-cyan-500/25 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Telemetry ID</span>
                <span
                  className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${selectedTrajectory.color}20`,
                    color: selectedTrajectory.color,
                    border: `1px solid ${selectedTrajectory.color}40`,
                  }}
                >
                  {selectedTrajectory.status}
                </span>
              </div>
              <p className="text-base font-display font-bold text-cyan-300">{selectedTrajectory.name}</p>
              <p className="text-gray-400 text-[11px]">{selectedTrajectory.type}</p>
            </div>

            {/* Origin & Target Route Card */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/20 space-y-3">
              {/* Origin */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Crosshair className="w-3 h-3 text-red-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Attack Origin</span>
                  <p className="font-semibold text-gray-200 truncate">{selectedTrajectory.sourceCity.name}, {selectedTrajectory.sourceCity.country}</p>
                  <p className="font-mono text-[10px] text-red-400">{selectedTrajectory.sourceCity.ip} (AS Autonomous System)</p>
                </div>
              </div>

              {/* Trajectory Divider */}
              <div className="h-px bg-gradient-to-r from-red-500/40 via-cyan-500/40 to-emerald-500/40" />

              {/* Target */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Server className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Defended Target</span>
                  <p className="font-semibold text-gray-200 truncate">{selectedTrajectory.targetCity.name}, {selectedTrajectory.targetCity.country}</p>
                  <p className="font-mono text-[10px] text-emerald-400">{selectedTrajectory.targetCity.ip}</p>
                </div>
              </div>
            </div>

            {/* Technical Breakdown Attributes */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-black/60 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">MITRE Technique</span>
                <p className="font-mono text-cyan-300 font-bold truncate">{selectedTrajectory.mitreTechnique}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-black/60 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">CVE Signature</span>
                <p className="font-mono text-amber-400 font-bold truncate">{selectedTrajectory.cve}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-black/60 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Bandwidth Flow</span>
                <p className="font-mono text-red-400 font-bold">{selectedTrajectory.bandwidth}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-black/60 border border-gray-800">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Severity Class</span>
                <p className="font-bold text-red-400">{selectedTrajectory.severity}</p>
              </div>
            </div>

            {/* Action Button: Block Trajectory Origin */}
            {selectedTrajectory.status === 'ACTIVE' ? (
              <button
                onClick={handleBlockThreat}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-purple-600 hover:brightness-110 text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Inject Edge Firewall Block Rule</span>
              </button>
            ) : (
              <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 text-center">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Traffic Stream Successfully Neutralized</span>
              </div>
            )}
          </div>
        </CyberPanel>
      </div>

      {/* Real-time Global Trajectory Table */}
      <CyberPanel
        title="Live Global Threat Stream Registry"
        icon={<Activity className="w-4 h-4 text-cyan-400" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-cyan-500/20 text-gray-400 uppercase text-[10px] font-semibold">
                <th className="py-3 px-4">Trajectory ID</th>
                <th className="py-3 px-4">Attack Vector</th>
                <th className="py-3 px-4">Origin Node (AS)</th>
                <th className="py-3 px-4">Target Node</th>
                <th className="py-3 px-4">Bandwidth</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-sans">
              {trajectories.map((trj) => (
                <tr
                  key={trj.id}
                  onClick={() => setSelectedTrajectory(trj)}
                  className={`hover:bg-cyan-500/10 transition-colors cursor-pointer ${
                    selectedTrajectory.id === trj.id ? 'bg-cyan-500/15' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{trj.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-200">
                    <div>{trj.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{trj.cve}</div>
                  </td>
                  <td className="py-3 px-4 text-red-400 font-medium">
                    {trj.sourceCity.name}, {trj.sourceCity.country}
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-medium">
                    {trj.targetCity.name}, {trj.targetCity.country}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-300">{trj.bandwidth}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        trj.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : trj.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      }`}
                    >
                      {trj.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrajectory(trj);
                        handleBlockThreat();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[10px] font-semibold uppercase transition-all"
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CyberPanel>
    </ViewContainer>
  );
}
