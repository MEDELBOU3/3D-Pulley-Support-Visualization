  // Main Three.js setup
        const container = document.getElementById('container');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(100, 70, 100);
        
        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.physicallyCorrectLights = true;
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        scene.add(directionalLight);

        // Adding point lights for better illumination
        const pointLight1 = new THREE.PointLight(0xffffff, 0.5);
        pointLight1.position.set(-50, 50, -50);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.3);
        pointLight2.position.set(50, -50, 50);
        scene.add(pointLight2);
        
        // Controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxDistance = 200;
        controls.minDistance = 20;
        
        // Grid helper
        const gridHelper = new THREE.GridHelper(100, 20, 0x888888, 0x444444);
        gridHelper.position.y = -0.01; // Slightly below the origin to avoid z-fighting
        scene.add(gridHelper);

        // Axis helper
        const axisHelper = new THREE.AxesHelper(20);
        scene.add(axisHelper);

        // Materials with physically-based rendering properties
        const materials = {
            red: new THREE.MeshStandardMaterial({ 
                color: 0xdd3333, 
                roughness: 0.4, 
                metalness: 0.2,
                envMapIntensity: 1.0
            }),
            green: new THREE.MeshStandardMaterial({ 
                color: 0x33dd33, 
                roughness: 0.2, 
                metalness: 0.1,
                envMapIntensity: 1.0
            }),
            blue: new THREE.MeshStandardMaterial({ 
                color: 0x3333dd, 
                roughness: 0.5, 
                metalness: 0.2,
                envMapIntensity: 1.0
            }),
            yellow: new THREE.MeshStandardMaterial({ 
                color: 0xdddd33, 
                roughness: 0.3, 
                metalness: 0.1,
                envMapIntensity: 1.0
            }),
            metal: new THREE.MeshStandardMaterial({ 
                color: 0xaaaaaa, 
                metalness: 0.8, 
                roughness: 0.2,
                envMapIntensity: 1.0
            }),
            cyan: new THREE.MeshStandardMaterial({ 
                color: 0x33dddd, 
                roughness: 0.3, 
                metalness: 0.2,
                envMapIntensity: 1.0
            }),
            highlight: new THREE.MeshStandardMaterial({ 
                color: 0xff9900, 
                roughness: 0.3, 
                metalness: 0.5,
                emissive: 0xff6600,
                emissiveIntensity: 0.5,
                envMapIntensity: 1.0
            })
        };

        // Actual measurements based on technical drawing (in mm, scaled down by 10 for display)
        const measurements = {
            bracket: {
                width: 31.25 / 10,
                height: 42.5 / 10,
                depth: 7.5 / 10
            },
            pulley: {
                diameter: 30 / 10,
                thickness: 10 / 10
            },
            shaft: {
                diameter: 15 / 10,
                length: 31.25 / 10
            },
            bushing: {
                diameter: 11.25 / 10,
                length: 20 / 10
            },
            washer: {
                outerDiameter: 15 / 10,
                innerDiameter: 5 / 10,
                thickness: 1 / 10
            },
            capScrew: {
                diameter: 3.5 / 10,
                length: 33.75 / 10,
                headDiameter: 8 / 10,
                headHeight: 3 / 10
            },
            turnScrew: {
                diameter: 2.5 / 10,
                length: 27.25 / 10,
                headWidth: 6 / 10,
                headHeight: 3 / 10
            },
            nut: {
                width: 8 / 10,
                height: 3 / 10,
                diameter: 3.5 / 10
            }
        };

        // Create component parts
        // Arrays to store component references
        const parts = {};
        const group = new THREE.Group();
        
        // Support bracket (base)
        parts.bracket = new THREE.Mesh(
            new THREE.BoxGeometry(measurements.bracket.width, measurements.bracket.height, measurements.bracket.depth),
            materials.red
        );
        parts.bracket.position.set(0, measurements.bracket.height / 2, 0);
        parts.bracket.castShadow = true;
        parts.bracket.receiveShadow = true;
        group.add(parts.bracket);
        
        // Pulley wheel
        const pulleyGeometry = new THREE.CylinderGeometry(
            measurements.pulley.diameter / 2,
            measurements.pulley.diameter / 2,
            measurements.pulley.thickness,
            32
        );
        parts.pulleyWheel = new THREE.Mesh(pulleyGeometry, materials.green);
        parts.pulleyWheel.rotation.x = Math.PI / 2;
        parts.pulleyWheel.position.set(measurements.shaft.length / 2, measurements.bracket.height * 0.7, 0);
        parts.pulleyWheel.castShadow = true;
        parts.pulleyWheel.receiveShadow = true;
        group.add(parts.pulleyWheel);
        
        // Axle/shaft
        parts.shaft = new THREE.Mesh(
            new THREE.CylinderGeometry(
                measurements.shaft.diameter / 2,
                measurements.shaft.diameter / 2,
                measurements.shaft.length,
                16
            ),
            materials.yellow
        );
        parts.shaft.rotation.z = Math.PI / 2;
        parts.shaft.position.set(measurements.shaft.length / 2, measurements.bracket.height * 0.7, 0);
        parts.shaft.castShadow = true;
        parts.shaft.receiveShadow = true;
        group.add(parts.shaft);
        
        // Bushing (inner wheel component)
        parts.bushing = new THREE.Mesh(
            new THREE.CylinderGeometry(
                measurements.bushing.diameter / 2,
                measurements.bushing.diameter / 2,
                measurements.bushing.length,
                16
            ),
            materials.cyan
        );
        parts.bushing.rotation.x = Math.PI / 2;
        parts.bushing.position.set(measurements.shaft.length / 2, measurements.bracket.height * 0.7, 0);
        parts.bushing.castShadow = true;
        parts.bushing.receiveShadow = true;
        group.add(parts.bushing);
        
        // Washer 1
        parts.washer1 = new THREE.Mesh(
            new THREE.CylinderGeometry(
                measurements.washer.outerDiameter / 2,
                measurements.washer.outerDiameter / 2,
                measurements.washer.thickness,
                16
            ),
            materials.metal
        );
        parts.washer1.rotation.z = Math.PI / 2;
        parts.washer1.position.set(
            (measurements.shaft.length / 2) - (measurements.pulley.thickness / 2) - measurements.washer.thickness,
            measurements.bracket.height * 0.7,
            0
        );
        parts.washer1.castShadow = true;
        parts.washer1.receiveShadow = true;
        group.add(parts.washer1);
        
        // Washer 2
        parts.washer2 = new THREE.Mesh(
            new THREE.CylinderGeometry(
                measurements.washer.outerDiameter / 2,
                measurements.washer.outerDiameter / 2,
                measurements.washer.thickness,
                16
            ),
            materials.metal
        );
        parts.washer2.rotation.z = Math.PI / 2;
        parts.washer2.position.set(
            (measurements.shaft.length / 2) + (measurements.pulley.thickness / 2) + measurements.washer.thickness,
            measurements.bracket.height * 0.7,
            0
        );
        parts.washer2.castShadow = true;
        parts.washer2.receiveShadow = true;
        group.add(parts.washer2);
        
        // Cap Screw 1 (left side)
        parts.capScrew1 = new THREE.Group();
        // Screw shaft
        const screwShaft1 = new THREE.Mesh(
            new THREE.CylinderGeometry(
                measurements.capScrew.diameter / 2,
                measurements.capScrew.diameter / 2,
                measurements.capScrew.length - measurements.capScrew.headHeight,
                12
            ),
            materials.metal
        );
        screwShaft1.position.y = -measurements.capScrew.headHeight / 2;
        parts.capScrew1.add(screwShaft1);
        
        // Screw head
        const screwHead1 = new THREE.Mesh(
            new THREE.CylinderGeometry(
                measurements.capScrew.headDiameter / 2,
                measurements.capScrew.headDiameter / 2,
                measurements.capScrew.headHeight,
                12
            ),
            materials.blue
        );
        screwHead1.position.y = measurements.capScrew.headHeight / 2;
        parts.capScrew1.add(screwHead1);
        
        parts.capScrew1.rotation.z = Math.PI / 2;
        parts.capScrew1.position.set(
            0,
            measurements.bracket.height * 0.7,
            0
        );
        parts.capScrew1.castShadow = true;
        parts.capScrew1.receiveShadow = true;
        group.add(parts.capScrew1);
        
        // Cap Screw 2 (right side)
        parts.capScrew2 = parts.capScrew1.clone();
        parts.capScrew2.rotation.z = -Math.PI / 2;
        parts.capScrew2.position.set(
            measurements.shaft.length,
            measurements.bracket.height * 0.7,
            0
        );
        group.add(parts.capScrew2);
        
        // Nuts
        parts.nut1 = new THREE.Mesh(
            new THREE.CylinderGeometry(
                measurements.nut.width / 2,
                measurements.nut.width / 2,
                measurements.nut.height,
                6
            ),
            materials.metal
        );
        parts.nut1.position.set(
            measurements.shaft.length + measurements.nut.height + 0.05,
            measurements.bracket.height * 0.7,
            0
        );
        parts.nut1.rotation.z = Math.PI / 2;
        parts.nut1.castShadow = true;
        parts.nut1.receiveShadow = true;
        group.add(parts.nut1);
        
        parts.nut2 = parts.nut1.clone();
        parts.nut2.position.set(
            -measurements.nut.height - 0.05,
            measurements.bracket.height * 0.7,
            0
        );
        group.add(parts.nut2);

        // Create chamfer on the pulley (45° bevel on edges)
        const chamferGeometry = new THREE.TorusGeometry(
            (measurements.pulley.diameter / 2) - 0.075,
            0.075,
            8,
            32
        );
        const chamfer1 = new THREE.Mesh(chamferGeometry, materials.green);
        chamfer1.position.set(
            measurements.shaft.length / 2,
            measurements.bracket.height * 0.7,
            measurements.pulley.thickness / 2
        );
        chamfer1.rotation.x = Math.PI / 2;
        group.add(chamfer1);
        
        const chamfer2 = chamfer1.clone();
        chamfer2.position.z = -measurements.pulley.thickness / 2;
        group.add(chamfer2);

        // Create holes in bracket
        const holeDiameter = measurements.turnScrew.diameter;
        const holeDepth = measurements.bracket.depth + 0.1;
        const holeGeometry = new THREE.CylinderGeometry(holeDiameter / 2, holeDiameter / 2, holeDepth, 16);
        
        // First hole
        const hole1 = new THREE.Mesh(
            holeGeometry,
            new THREE.MeshBasicMaterial({ color: 0x000000 })
        );
        hole1.position.set(0, measurements.bracket.height * 0.3, 0);
        hole1.rotation.x = Math.PI / 2;
        parts.bracket.add(hole1);
        
        // Second hole
        const hole2 = hole1.clone();
        hole2.position.set(0, measurements.bracket.height * 0.7, 0);
        parts.bracket.add(hole2);

        // Add group to scene
        scene.add(group);
        
        // Dimensions lines and text
        const dimensionGroup = new THREE.Group();
        scene.add(dimensionGroup);
        dimensionGroup.visible = false;
        
        // Function to create dimension line
        function createDimensionLine(start, end, value, position, rotation = 0, color = 0xff0000) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(start.x, start.y, start.z),
                new THREE.Vector3(end.x, end.y, end.z)
            ]);
            
            const lineMaterial = new THREE.LineBasicMaterial({ color: color });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            
            // Add little perpendicular lines at ends (dimension indicators)
            const indicatorLength = 0.5;
            const direction = new THREE.Vector3().subVectors(end, start).normalize();
            const perpendicular = new THREE.Vector3(-direction.y, direction.x, direction.z);
            
            // Start indicator
            const startIndGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(start.x - perpendicular.x * indicatorLength, 
                                  start.y - perpendicular.y * indicatorLength, 
                                  start.z - perpendicular.z * indicatorLength),
                new THREE.Vector3(start.x + perpendicular.x * indicatorLength, 
                                  start.y + perpendicular.y * indicatorLength, 
                                  start.z + perpendicular.z * indicatorLength)
            ]);
            const startIndicator = new THREE.Line(startIndGeometry, lineMaterial);
            
            // End indicator
            const endIndGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(end.x - perpendicular.x * indicatorLength, 
                                  end.y - perpendicular.y * indicatorLength, 
                                  end.z - perpendicular.z * indicatorLength),
                new THREE.Vector3(end.x + perpendicular.x * indicatorLength, 
                                  end.y + perpendicular.y * indicatorLength, 
                                  end.z + perpendicular.z * indicatorLength)
            ]);
            const endIndicator = new THREE.Line(endIndGeometry, lineMaterial);
            
            // Create text label
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 128;
            canvas.height = 32;
            
            context.fillStyle = 'rgba(255, 255, 255, 0.8)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            context.font = '24px Arial';
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(value + ' mm', canvas.width / 2, canvas.height / 2);
            
            const texture = new THREE.CanvasTexture(canvas);
            const labelMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const labelGeometry = new THREE.PlaneGeometry(5, 1.5);
            const label = new THREE.Mesh(labelGeometry, labelMaterial);
            
            // Position label
            const midPoint = new THREE.Vector3(
                (start.x + end.x) / 2,
                (start.y + end.y) / 2,
                (start.z + end.z) / 2
            );
            
            if (position) {
                label.position.copy(position);
            } else {
                label.position.copy(midPoint);
                label.position.y += 1; // Offset to avoid overlap
            }
            
            label.rotation.x = -Math.PI / 2;
            label.rotation.z = rotation;
            
            // Group them all
            const dimensionGroup = new THREE.Group();
            dimensionGroup.add(line);
            dimensionGroup.add(startIndicator);
            dimensionGroup.add(endIndicator);
            dimensionGroup.add(label);
            
            return dimensionGroup;
        }
        
        // Create dimensions for main components
        // Bracket height
        const bracketHeightDim = createDimensionLine(
            new THREE.Vector3(measurements.bracket.width / 2 + 3, 0, 0),
            new THREE.Vector3(measurements.bracket.width / 2 + 3, measurements.bracket.height, 0),
            (measurements.bracket.height * 10).toFixed(1),
            new THREE.Vector3(measurements.bracket.width / 2 + 5, measurements.bracket.height / 2, 0),
            Math.PI / 2
        );
        dimensionGroup.add(bracketHeightDim);
        
        // Bracket width
        const bracketWidthDim = createDimensionLine(
            new THREE.Vector3(-measurements.bracket.width / 2, measurements.bracket.height + 3, 0),
            new THREE.Vector3(measurements.bracket.width / 2, measurements.bracket.height + 3, 0),
            (measurements.bracket.width * 10).toFixed(1),
            new THREE.Vector3(0, measurements.bracket.height + 5, 0),
            0
        );
        dimensionGroup.add(bracketWidthDim);
        
        // Pulley diameter
        const pulleyDiamDim = createDimensionLine(
            new THREE.Vector3(
                measurements.shaft.length / 2,
                measurements.bracket.height * 0.7 - measurements.pulley.diameter / 2,
                measurements.pulley.thickness / 2 + 3
            ),
            new THREE.Vector3(
                measurements.shaft.length / 2,
                measurements.bracket.height * 0.7 + measurements.pulley.diameter / 2,
                measurements.pulley.thickness / 2 + 3
            ),
            (measurements.pulley.diameter * 10).toFixed(1),
            new THREE.Vector3(
                measurements.shaft.length / 2,
                measurements.bracket.height * 0.7,
                measurements.pulley.thickness / 2 + 5
            ),
            Math.PI / 2
        );
        dimensionGroup.add(pulleyDiamDim);
        
        // Shaft length
        const shaftLengthDim = createDimensionLine(
            new THREE.Vector3(0, measurements.bracket.height * 0.7, -3),
            new THREE.Vector3(measurements.shaft.length, measurements.bracket.height * 0.7, -3),
            (measurements.shaft.length * 10).toFixed(1),
            new THREE.Vector3(measurements.shaft.length / 2, measurements.bracket.height * 0.7, -5),
            0
        );
        dimensionGroup.add(shaftLengthDim);
        
        // Original positions for reset/animations
        const originalPositions = {};
        for (const key in parts) {
            originalPositions[key] = {
                position: parts[key].position.clone(),
                rotation: parts[key].rotation.clone()
            };
        }

        // Highlighting system
        let currentHighlightIndex = -1;
        const partKeys = Object.keys(parts);
        let originalMaterials = {};
        
        function highlightNextPart() {
            // Reset previous highlight
            if (currentHighlightIndex >= 0) {
                const prevKey = partKeys[currentHighlightIndex];
                parts[prevKey].material = originalMaterials[prevKey];
            }
            
            // Move to next part
            currentHighlightIndex = (currentHighlightIndex + 1) % partKeys.length;
            const key = partKeys[currentHighlightIndex];
            
            // Store original material
            if (!originalMaterials[key]) {
                originalMaterials[key] = parts[key].material;
            }
            
            // Apply highlight material
            parts[key].material = materials.highlight;
            
            // Update info
            const measurementsDiv = document.getElementById('measurements');
            measurementsDiv.classList.remove('hidden');
            
            // Scroll to the relevant row if possible
            const rows = document.querySelectorAll('#measurements tbody tr');
            
            // Approximate mapping between part keys and table rows
            const partToRow = {
    'bracket': 0,
    'pulleyWheel': 1,
    'bushing': 2,
    'shaft': 3,
    'washer1': 4,
    'washer2': 4,
    'capScrew1': 5,
    'capScrew2': 5,
    'nut1': 7,
    'nut2': 7
};

if (partToRow.hasOwnProperty(key) && rows[partToRow[key]]) {
    rows[partToRow[key]].scrollIntoView({ behavior: 'smooth', block: 'center' });
    rows[partToRow[key]].style.backgroundColor = 'rgba(255, 153, 0, 0.3)';
    setTimeout(() => {
        rows[partToRow[key]].style.backgroundColor = '';
    }, 2000);
}
}

// Animation system
let isRotating = false;
let rotationSpeed = 0.02;

function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    
    if (isRotating) {
        parts.pulleyWheel.rotation.x += rotationSpeed;
        parts.bushing.rotation.x += rotationSpeed;
    }
    
    TWEEN.update();
    renderer.render(scene, camera);
}

// Explosion animation
function explode() {
    const duration = 2000;
    const spacing = 5;
    
    // Define explosion positions for each part
    const explosionPositions = {
        bracket: { x: 0, y: -spacing * 2, z: 0 },
        pulleyWheel: { x: spacing * 2, y: spacing, z: spacing },
        bushing: { x: -spacing * 2, y: spacing, z: -spacing },
        shaft: { x: 0, y: spacing * 2, z: 0 },
        washer1: { x: -spacing, y: 0, z: spacing },
        washer2: { x: spacing, y: 0, z: -spacing },
        capScrew1: { x: -spacing * 1.5, y: -spacing, z: 0 },
        capScrew2: { x: spacing * 1.5, y: -spacing, z: 0 },
        nut1: { x: spacing * 2, y: -spacing * 2, z: spacing },
        nut2: { x: -spacing * 2, y: -spacing * 2, z: -spacing }
    };
    
    for (const key in parts) {
        const part = parts[key];
        const targetPos = explosionPositions[key];
        
        new TWEEN.Tween(part.position)
            .to({
                x: originalPositions[key].position.x + targetPos.x,
                y: originalPositions[key].position.y + targetPos.y,
                z: originalPositions[key].position.z + targetPos.z
            }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }
}

// Assembly animation
function assemble() {
    const duration = 2000;
    
    for (const key in parts) {
        const part = parts[key];
        
        new TWEEN.Tween(part.position)
            .to({
                x: originalPositions[key].position.x,
                y: originalPositions[key].position.y,
                z: originalPositions[key].position.z
            }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        
        new TWEEN.Tween(part.rotation)
            .to({
                x: originalPositions[key].rotation.x,
                y: originalPositions[key].rotation.y,
                z: originalPositions[key].rotation.z
            }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }
}

// Event Listeners
document.getElementById('rotate').addEventListener('click', () => {
    isRotating = !isRotating;
    document.getElementById('rotate').textContent = isRotating ? 'Stop Rotation' : 'Rotate Pulley';
});

document.getElementById('disassemble').addEventListener('click', explode);
document.getElementById('assemble').addEventListener('click', assemble);

document.getElementById('reset').addEventListener('click', () => {
    camera.position.set(100, 70, 100);
    camera.lookAt(0, 0, 0);
    controls.reset();
});

document.getElementById('highlight-next').addEventListener('click', highlightNextPart);

document.getElementById('toggle-dimensions').addEventListener('click', () => {
    dimensionGroup.visible = !dimensionGroup.visible;
});

document.getElementById('toggle-measurements').addEventListener('click', () => {
    const measurementsDiv = document.getElementById('measurements');
    measurementsDiv.classList.toggle('hidden');
});

// Window resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Remove loading screen when everything is ready
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading');
    loadingScreen.style.display = 'none';
});

// Start animation loop
animate();
