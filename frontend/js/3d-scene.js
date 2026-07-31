document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-3d-canvas');
    if (!container || typeof THREE === 'undefined') return;

    // Scene Setup
    const scene = new THREE.Scene();

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Geometry & Material
    // Abstract Icosahedron to represent the "mind" or "wellness crystal"
    const geometry = new THREE.IcosahedronGeometry(1.8, 1); // Radius 1.8, detail 1
    
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xfd9621, // MindWell Orange
        emissive: 0x5a2d0c, // Slight warm glow
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        wireframe: false,
        flatShading: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Inner Wireframe for depth
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffedd5, // Light orange tint
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    mesh.add(wireframe);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xffaa00, 0.8);
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);

    // Mouse Interaction (Parallax)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Slow continuous rotation
        mesh.rotation.y += 0.005;
        mesh.rotation.x += 0.002;

        // Mouse Parallax effect
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
        mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);

        // Gentle floating effect
        mesh.position.y = Math.sin(Date.now() * 0.001) * 0.1;

        renderer.render(scene, camera);
    };

    animate();

    // Responsive Resize
    window.addEventListener('resize', () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
});
