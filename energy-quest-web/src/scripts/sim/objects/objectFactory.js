import * as THREE from 'three';

/**
 * Factory for creating interactive objects in the simulation
 */
export class ObjectFactory {
  constructor() {
    this.objectTypes = [
      'building', 'tree', 'car', 'person', 'lamp', 'bench', 'fountain', 
      'statue', 'bicycle', 'trashcan', 'sign', 'flower', 'rock', 'bird',
      'dog', 'cat', 'balloon', 'kite', 'cloud', 'star', 'moon', 'sun',
      'rainbow', 'butterfly', 'bee', 'fish', 'duck', 'swan', 'eagle',
      'squirrel', 'rabbit', 'deer', 'bear', 'fox', 'wolf', 'lion',
      'tiger', 'elephant', 'giraffe', 'zebra', 'penguin', 'panda',
      'koala', 'kangaroo', 'monkey', 'dolphin', 'whale', 'shark',
      'octopus', 'jellyfish', 'starfish', 'crab', 'lobster', 'turtle'
    ];
    
    this.materials = this.createMaterials();
  }

  createMaterials() {
    const materials = {};
    
    // Building materials
    materials.building = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    materials.tree = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    materials.car = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    materials.person = new THREE.MeshLambertMaterial({ color: 0xFFB6C1 });
    materials.lamp = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
    materials.bench = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    materials.fountain = new THREE.MeshLambertMaterial({ color: 0x87CEEB });
    materials.statue = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
    materials.bicycle = new THREE.MeshLambertMaterial({ color: 0x0000FF });
    materials.trashcan = new THREE.MeshLambertMaterial({ color: 0x696969 });
    materials.sign = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    materials.flower = new THREE.MeshLambertMaterial({ color: 0xFF69B4 });
    materials.rock = new THREE.MeshLambertMaterial({ color: 0x708090 });
    
    // Animal materials
    materials.bird = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    materials.dog = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    materials.cat = new THREE.MeshLambertMaterial({ color: 0xFFA500 });
    materials.balloon = new THREE.MeshLambertMaterial({ color: 0xFF1493 });
    materials.kite = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
    materials.cloud = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    materials.star = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
    materials.moon = new THREE.MeshLambertMaterial({ color: 0xF0F8FF });
    materials.sun = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    materials.rainbow = new THREE.MeshLambertMaterial({ color: 0xFF69B4 });
    materials.butterfly = new THREE.MeshLambertMaterial({ color: 0xFF1493 });
    materials.bee = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
    materials.fish = new THREE.MeshLambertMaterial({ color: 0x00BFFF });
    materials.duck = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    materials.swan = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    materials.eagle = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    materials.squirrel = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    materials.rabbit = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    materials.deer = new THREE.MeshLambertMaterial({ color: 0xDEB887 });
    materials.bear = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    materials.fox = new THREE.MeshLambertMaterial({ color: 0xFF4500 });
    materials.wolf = new THREE.MeshLambertMaterial({ color: 0x808080 });
    materials.lion = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    materials.tiger = new THREE.MeshLambertMaterial({ color: 0xFF4500 });
    materials.elephant = new THREE.MeshLambertMaterial({ color: 0x808080 });
    materials.giraffe = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    materials.zebra = new THREE.MeshLambertMaterial({ color: 0x000000 });
    materials.penguin = new THREE.MeshLambertMaterial({ color: 0x000000 });
    materials.panda = new THREE.MeshLambertMaterial({ color: 0x000000 });
    materials.koala = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    materials.kangaroo = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    materials.monkey = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    materials.dolphin = new THREE.MeshLambertMaterial({ color: 0x00BFFF });
    materials.whale = new THREE.MeshLambertMaterial({ color: 0x808080 });
    materials.shark = new THREE.MeshLambertMaterial({ color: 0x808080 });
    materials.octopus = new THREE.MeshLambertMaterial({ color: 0xFF69B4 });
    materials.jellyfish = new THREE.MeshLambertMaterial({ color: 0xFFB6C1 });
    materials.starfish = new THREE.MeshLambertMaterial({ color: 0xFF4500 });
    materials.crab = new THREE.MeshLambertMaterial({ color: 0xFF4500 });
    materials.lobster = new THREE.MeshLambertMaterial({ color: 0xFF4500 });
    materials.turtle = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    
    return materials;
  }

  createObject(type, position = new THREE.Vector3(0, 0, 0)) {
    const geometry = this.createGeometry(type);
    const material = this.materials[type] || this.materials.building;
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Add object properties
    mesh.userData = {
      type: type,
      id: Math.random().toString(36).substr(2, 9),
      isInteractive: true,
      isAnimating: false,
      animationSpeed: Math.random() * 0.02 + 0.01,
      originalPosition: position.clone(),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      ),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      scale: Math.random() * 0.5 + 0.5,
      energy: Math.random() * 100,
      isGlowing: false,
      glowIntensity: 0
    };
    
    // Set initial scale
    mesh.scale.setScalar(mesh.userData.scale);
    
    return mesh;
  }

  createGeometry(type) {
    switch (type) {
      case 'building':
        return new THREE.BoxGeometry(2, 4, 2);
      case 'tree':
        const treeGroup = new THREE.Group();
        const trunk = new THREE.CylinderGeometry(0.3, 0.5, 2);
        const leaves = new THREE.SphereGeometry(1.5, 8, 6);
        leaves.translate(0, 2, 0);
        treeGroup.add(new THREE.Mesh(trunk, this.materials.tree));
        treeGroup.add(new THREE.Mesh(leaves, this.materials.tree));
        return treeGroup;
      case 'car':
        return new THREE.BoxGeometry(1.5, 0.8, 3);
      case 'person':
        const personGroup = new THREE.Group();
        const body = new THREE.CylinderGeometry(0.3, 0.3, 1.5);
        const head = new THREE.SphereGeometry(0.3);
        head.translate(0, 1.2, 0);
        personGroup.add(new THREE.Mesh(body, this.materials.person));
        personGroup.add(new THREE.Mesh(head, this.materials.person));
        return personGroup;
      case 'lamp':
        const lampGroup = new THREE.Group();
        const pole = new THREE.CylinderGeometry(0.1, 0.1, 3);
        const light = new THREE.SphereGeometry(0.3);
        light.translate(0, 1.8, 0);
        lampGroup.add(new THREE.Mesh(pole, this.materials.lamp));
        lampGroup.add(new THREE.Mesh(light, this.materials.lamp));
        return lampGroup;
      case 'bench':
        return new THREE.BoxGeometry(3, 0.3, 0.8);
      case 'fountain':
        return new THREE.CylinderGeometry(1, 1.5, 1);
      case 'statue':
        return new THREE.ConeGeometry(0.5, 2, 8);
      case 'bicycle':
        return new THREE.BoxGeometry(0.3, 1, 2);
      case 'trashcan':
        return new THREE.CylinderGeometry(0.5, 0.5, 1.2);
      case 'sign':
        return new THREE.BoxGeometry(0.1, 2, 1);
      case 'flower':
        const flowerGroup = new THREE.Group();
        const stem = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
        const petals = new THREE.SphereGeometry(0.3, 8, 6);
        petals.translate(0, 0.5, 0);
        flowerGroup.add(new THREE.Mesh(stem, this.materials.flower));
        flowerGroup.add(new THREE.Mesh(petals, this.materials.flower));
        return flowerGroup;
      case 'rock':
        return new THREE.DodecahedronGeometry(0.8);
      case 'balloon':
        return new THREE.SphereGeometry(0.5, 8, 6);
      case 'kite':
        return new THREE.ConeGeometry(0.3, 1, 4);
      case 'cloud':
        return new THREE.SphereGeometry(1, 8, 6);
      case 'star':
        return new THREE.OctahedronGeometry(0.5);
      case 'moon':
        return new THREE.SphereGeometry(0.8, 8, 6);
      case 'sun':
        return new THREE.SphereGeometry(1, 8, 6);
      case 'rainbow':
        return new THREE.TorusGeometry(1, 0.1, 8, 100);
      case 'butterfly':
        return new THREE.BoxGeometry(0.3, 0.1, 0.8);
      case 'bee':
        return new THREE.SphereGeometry(0.2, 8, 6);
      case 'fish':
        return new THREE.ConeGeometry(0.3, 0.8, 6);
      case 'bird':
        return new THREE.ConeGeometry(0.2, 0.5, 6);
      case 'duck':
        return new THREE.SphereGeometry(0.4, 8, 6);
      case 'swan':
        return new THREE.SphereGeometry(0.5, 8, 6);
      case 'eagle':
        return new THREE.ConeGeometry(0.3, 0.8, 6);
      case 'squirrel':
        return new THREE.SphereGeometry(0.3, 8, 6);
      case 'rabbit':
        return new THREE.SphereGeometry(0.4, 8, 6);
      case 'deer':
        return new THREE.ConeGeometry(0.4, 1, 6);
      case 'bear':
        return new THREE.SphereGeometry(0.8, 8, 6);
      case 'fox':
        return new THREE.ConeGeometry(0.3, 0.8, 6);
      case 'wolf':
        return new THREE.ConeGeometry(0.4, 1, 6);
      case 'lion':
        return new THREE.SphereGeometry(0.7, 8, 6);
      case 'tiger':
        return new THREE.SphereGeometry(0.7, 8, 6);
      case 'elephant':
        return new THREE.SphereGeometry(1.2, 8, 6);
      case 'giraffe':
        return new THREE.CylinderGeometry(0.3, 0.3, 2);
      case 'zebra':
        return new THREE.CylinderGeometry(0.4, 0.4, 1.5);
      case 'penguin':
        return new THREE.ConeGeometry(0.4, 1, 6);
      case 'panda':
        return new THREE.SphereGeometry(0.6, 8, 6);
      case 'koala':
        return new THREE.SphereGeometry(0.5, 8, 6);
      case 'kangaroo':
        return new THREE.ConeGeometry(0.3, 1.2, 6);
      case 'monkey':
        return new THREE.SphereGeometry(0.4, 8, 6);
      case 'dolphin':
        return new THREE.ConeGeometry(0.5, 1.5, 6);
      case 'whale':
        return new THREE.SphereGeometry(1.5, 8, 6);
      case 'shark':
        return new THREE.ConeGeometry(0.6, 1.2, 6);
      case 'octopus':
        return new THREE.SphereGeometry(0.6, 8, 6);
      case 'jellyfish':
        return new THREE.SphereGeometry(0.4, 8, 6);
      case 'starfish':
        return new THREE.OctahedronGeometry(0.4);
      case 'crab':
        return new THREE.BoxGeometry(0.6, 0.3, 0.8);
      case 'lobster':
        return new THREE.ConeGeometry(0.3, 1, 6);
      case 'turtle':
        return new THREE.SphereGeometry(0.5, 8, 6);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }

  generateRandomObjects(count = 50, bounds = { min: -20, max: 20 }) {
    const objects = [];
    
    for (let i = 0; i < count; i++) {
      const type = this.objectTypes[Math.floor(Math.random() * this.objectTypes.length)];
      const position = new THREE.Vector3(
        Math.random() * (bounds.max - bounds.min) + bounds.min,
        Math.random() * 5 + 0.5, // Random height between 0.5 and 5.5
        Math.random() * (bounds.max - bounds.min) + bounds.min
      );
      
      const object = this.createObject(type, position);
      objects.push(object);
    }
    
    return objects;
  }

  createParticleSystem(object) {
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;
      
      colors[i3] = Math.random();
      colors[i3 + 1] = Math.random();
      colors[i3 + 2] = Math.random();
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const particleSystem = new THREE.Points(particles, material);
    particleSystem.position.copy(object.position);
    
    return particleSystem;
  }
}