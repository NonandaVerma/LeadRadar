import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Globe({ className = '' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth  || 720
    const H = mount.clientHeight || 720

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    /* ── Scene + Camera ── */
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000)
    camera.position.z = 2.8

    /* ── Globe group — everything rotates together ── */
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    /* ── Earth sphere ── */
    const geo     = new THREE.SphereGeometry(1, 64, 64)
    const loader  = new THREE.TextureLoader()
    const texture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg')
    const bump    = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg')

    const mat = new THREE.MeshPhongMaterial({
      map:       texture,
      bumpMap:   bump,
      bumpScale: 0.05,
      specular:  new THREE.Color('#1a2a35'),
      shininess: 8,
    })
    globeGroup.add(new THREE.Mesh(geo, mat))

    /* ── Atmosphere ── */
    const atmMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#AABBC5'),
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.08,
    })
    globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.06, 64, 64), atmMat))

    /* ── Lights ── */
    const keyLight = new THREE.DirectionalLight('#ffffff', 1.4)
    keyLight.position.set(5, 3, 5)
    scene.add(keyLight)
    scene.add(new THREE.AmbientLight('#1a2535', 0.8))
    const rimLight = new THREE.DirectionalLight('#AABBC5', 0.4)
    rimLight.position.set(-5, -2, -3)
    scene.add(rimLight)

    /* ── City markers ── */
    const toXYZ = (lat, lng, r = 1.015) => {
      const phi   = (90 - lat)  * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta),
      )
    }

    const cities = [
      // India — larger
      { lat: 19.07,  lng: 72.88,  size: 0.022, label: 'Mumbai' },
      { lat: 28.61,  lng: 77.21,  size: 0.022, label: 'Delhi' },
      { lat: 12.97,  lng: 77.59,  size: 0.020, label: 'Bangalore' },
      { lat: 17.38,  lng: 78.49,  size: 0.018, label: 'Hyderabad' },
      { lat: 22.57,  lng: 88.36,  size: 0.018, label: 'Kolkata' },
      { lat: 13.08,  lng: 80.27,  size: 0.018, label: 'Chennai' },
      { lat: 23.02,  lng: 72.57,  size: 0.016, label: 'Ahmedabad' },
      { lat: 18.52,  lng: 73.86,  size: 0.016, label: 'Pune' },
      // Global
      { lat: 40.71,  lng: -74.01, size: 0.018, label: 'New York' },
      { lat: 51.51,  lng: -0.13,  size: 0.018, label: 'London' },
      { lat: 25.20,  lng: 55.27,  size: 0.018, label: 'Dubai' },
      { lat: 1.35,   lng: 103.82, size: 0.016, label: 'Singapore' },
      { lat: 35.68,  lng: 139.65, size: 0.016, label: 'Tokyo' },
      { lat: -33.87, lng: 151.21, size: 0.016, label: 'Sydney' },
      { lat: 48.86,  lng: 2.35,   size: 0.016, label: 'Paris' },
      { lat: 37.77,  lng: -122.42,size: 0.016, label: 'San Francisco' },
      { lat: 55.76,  lng: 37.62,  size: 0.016, label: 'Moscow' },
      { lat: 31.23,  lng: 121.47, size: 0.016, label: 'Shanghai' },
    ]

    cities.forEach(({ lat, lng, size }) => {
      const pos = toXYZ(lat, lng)

      // Pin dot
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(size, 10, 10),
        new THREE.MeshBasicMaterial({ color: '#AABBC5' })
      )
      dot.position.copy(pos)
      globeGroup.add(dot)

      // Outer ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(size * 1.6, size * 2.2, 20),
        new THREE.MeshBasicMaterial({
          color: '#AABBC5',
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
        })
      )
      ring.position.copy(pos)
      ring.lookAt(new THREE.Vector3(0, 0, 0))
      globeGroup.add(ring)
    })

    /* ── Stars ── */
    const starVerts = []
    for (let i = 0; i < 1500; i++) {
      starVerts.push(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
      )
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#AABBC5', size: 0.06, transparent: true, opacity: 0.4 })))

    /* ── Mouse drag ── */
    let isDragging = false
    let prevX = 0, prevY = 0
    let rotY = 0, rotX = 0
    let autoRotate = true

    const onDown  = (e) => { isDragging = true; autoRotate = false; prevX = e.clientX; prevY = e.clientY; mount.style.cursor = 'grabbing' }
    const onUp    = () => { isDragging = false; mount.style.cursor = 'grab'; setTimeout(() => autoRotate = true, 2000) }
    const onMove  = (e) => {
      if (!isDragging) return
      rotY += (e.clientX - prevX) * 0.005
      rotX += (e.clientY - prevY) * 0.003
      rotX = Math.max(-0.5, Math.min(0.5, rotX))
      prevX = e.clientX; prevY = e.clientY
    }

    mount.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',  onUp)
    window.addEventListener('mousemove', onMove)

    /* ── Animate ── */
    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      if (autoRotate) rotY += 0.003
      globeGroup.rotation.y = rotY
      globeGroup.rotation.x = rotX
      renderer.render(scene, camera)
    }
    animate()

    /* ── Resize ── */
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameId)
      mount.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize',    onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
    />
  )
}