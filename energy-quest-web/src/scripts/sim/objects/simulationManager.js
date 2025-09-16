import * as THREE from 'three';
import { ObjectFactory } from './objectFactory.js';
import { PerformanceOptimizer } from './performanceOptimizer.js';

/**
 * Manages the simulation of 50+ interactive objects
 */
export class SimulationManager {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.objectFactory = new ObjectFactory();
    this.performanceOptimizer = new PerformanceOptimizer();
    this.objects = [];
    this.particleSystems = [];
    this.isRunning = false;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectedObject = null;
    this.animationId = null;
    this.frameCount = 0;
    this.lastFPSUpdate = 0;
    
    this.setupEventListeners();
    this.generateObjects();
  }

  generateObjects() {
    console.log('Generating 50 interactive objects...');
    
    // Clear existing objects
    this.clearObjects();
    
    // Generate 50 random objects
    this.objects = this.objectFactory.generateRandomObjects(50, { min: -25, max: 25 });
    
    // Add objects to scene
    this.objects.forEach(obj => {
      this.scene.add(obj);
    });
    
    // Add some particle systems for visual effects
    this.addParticleEffects();
    
    console.log(`Generated ${this.objects.length} interactive objects`);
  }

  addParticleEffects() {
    // Add particle systems to some objects
    const particleObjects = this.objects.filter((_, index) => index % 5 === 0);
    
    particleObjects.forEach(obj => {
      const particleSystem = this.objectFactory.createParticleSystem(obj);
      this.particleSystems.push(particleSystem);
      this.scene.add(particleSystem);
    });
  }

  setupEventListeners() {
    // Mouse click events
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    
    // Keyboard events
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  onMouseClick(event) {
    this.updateMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    const intersects = this.raycaster.intersectObjects(this.objects);
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      this.handleObjectClick(clickedObject);
    }
  }

  onMouseMove(event) {
    this.updateMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    const intersects = this.raycaster.intersectObjects(this.objects);
    
    // Update cursor style
    this.renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    
    // Highlight hovered object
    this.objects.forEach(obj => {
      if (obj.userData.isGlowing) {
        obj.material.emissive.setHex(0x000000);
        obj.userData.isGlowing = false;
      }
    });
    
    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      hoveredObject.material.emissive.setHex(0x444444);
      hoveredObject.userData.isGlowing = true;
    }
  }

  onKeyDown(event) {
    switch (event.key) {
      case 'r':
      case 'R':
        this.regenerateObjects();
        break;
      case ' ':
        event.preventDefault();
        this.toggleSimulation();
        break;
      case 'c':
      case 'C':
        this.clearObjects();
        break;
    }
  }

  updateMousePosition(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  handleObjectClick(object) {
    console.log(`Clicked on ${object.userData.type} (ID: ${object.userData.id})`);
    
    // Deselect previous object
    if (this.selectedObject) {
      this.selectedObject.material.emissive.setHex(0x000000);
    }
    
    // Select new object
    this.selectedObject = object;
    object.material.emissive.setHex(0x888888);
    
    // Trigger object-specific behavior
    this.triggerObjectBehavior(object);
    
    // Create click effect
    this.createClickEffect(object.position);
  }

  triggerObjectBehavior(object) {
    const type = object.userData.type;
    
    switch (type) {
      case 'building':
        this.animateBuilding(object);
        break;
      case 'tree':
        this.animateTree(object);
        break;
      case 'car':
        this.animateCar(object);
        break;
      case 'person':
        this.animatePerson(object);
        break;
      case 'lamp':
        this.toggleLamp(object);
        break;
      case 'fountain':
        this.animateFountain(object);
        break;
      case 'balloon':
        this.animateBalloon(object);
        break;
      case 'bird':
      case 'eagle':
        this.animateFlying(object);
        break;
      case 'fish':
      case 'dolphin':
      case 'whale':
        this.animateSwimming(object);
        break;
      default:
        this.animateGeneric(object);
    }
  }

  animateBuilding(object) {
    object.userData.isAnimating = true;
    const originalY = object.position.y;
    
    const animate = () => {
      if (!object.userData.isAnimating) return;
      
      object.position.y = originalY + Math.sin(Date.now() * 0.005) * 0.5;
      object.rotation.y += 0.01;
      
      if (Date.now() % 2000 < 100) {
        object.userData.isAnimating = false;
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  animateTree(object) {
    object.userData.isAnimating = true;
    const originalScale = object.scale.x;
    
    const animate = () => {
      if (!object.userData.isAnimating) return;
      
      const scale = originalScale + Math.sin(Date.now() * 0.01) * 0.1;
      object.scale.setScalar(scale);
      
      if (Date.now() % 3000 < 100) {
        object.userData.isAnimating = false;
        object.scale.setScalar(originalScale);
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  animateCar(object) {
    object.userData.isAnimating = true;
    const originalPosition = object.position.clone();
    
    const animate = () => {
      if (!object.userData.isAnimating) return;
      
      object.position.x = originalPosition.x + Math.sin(Date.now() * 0.01) * 2;
      object.rotation.y = Math.sin(Date.now() * 0.01) * 0.5;
      
      if (Date.now() % 4000 < 100) {
        object.userData.isAnimating = false;
        object.position.copy(originalPosition);
        object.rotation.y = 0;
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  animatePerson(object) {
    object.userData.isAnimating = true;
    const originalY = object.position.y;
    
    const animate = () => {
      if (!object.userData.isAnimating) return;
      
      object.position.y = originalY + Math.abs(Math.sin(Date.now() * 0.02)) * 0.3;
      object.rotation.z = Math.sin(Date.now() * 0.02) * 0.1;
      
      if (Date.now() % 2500 < 100) {
        object.userData.isAnimating = false;
        object.position.y = originalY;
        object.rotation.z = 0;
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  toggleLamp(object) {
    if (object.userData.isGlowing) {
      object.material.emissive.setHex(0x000000);
      object.userData.isGlowing = false;
    } else {
      object.material.emissive.setHex(0xFFFF00);
      object.userData.isGlowing = true;
    }
  }

  animateFountain(object) {
    object.userData.isAnimating = true;
    const originalY = object.position.y;
    
    const animate = () => {
      if (!object.userData.isAnimating) return;
      
      object.position.y = originalY + Math.sin(Date.now() * 0.01) * 0.2;
      object.rotation.y += 0.02;
      
      if (Date.now() % 5000 < 100) {
        object.userData.isAnimating = false;
        object.position.y = originalY;
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  animateBalloon(object) {
    object.userData.isAnimating = true;
    const originalY = object.position.y;
    
    const animate = () => {
      if (!object.userData.isAnimating) return;
      
      object.position.y = originalY + Math.sin(Date.now() * 0.005) * 1;
      object.rotation.x += 0.01;
      object.rotation.z += 0.01;
      
      if (Date.now() % 6000 < 100) {
        object.userData.isAnimating = false;
        object.position.y = originalY;
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  animateFlying(object) {
    object.userData.isAnimating = true;
    const originalPosition = object.position.clone();
    
    const animate = () => {
      if (!object.userData.isAnimating) return;
      
      object.position.x = originalPosition.x + Math.sin(Date.now() * 0.008) * 3;
      object.position.y = originalPosition.y + Math.sin(Date.now() * 0.01) * 1;
      object.position.z = originalPosition.z + Math.cos(Date.now() * 0.008) * 3;
      object.rotation.y += 0.02;
      
      if (Date.now() % 8000 < 100) {
        object.userData.isAnimating = false;
        object.position.copy(originalPosition);
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  animateSwimming(object) {
    object.userData.isAnimating = true;
    const originalPosition = object.position.clone();
    
    const animate = () => {
      if (!object.userData.isAnimating) return;
      
      object.position.x = originalPosition.x + Math.sin(Date.now() * 0.01) * 2;
      object.position.y = originalPosition.y + Math.sin(Date.now() * 0.02) * 0.5;
      object.position.z = originalPosition.z + Math.cos(Date.now() * 0.01) * 2;
      object.rotation.y += 0.03;
      
      if (Date.now() % 7000 < 100) {
        object.userData.isAnimating = false;
        object.position.copy(originalPosition);
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  animateGeneric(object) {
    object.userData.isAnimating = true;
    const originalScale = object.scale.x;
    
    const animate = () => {
      if (!object.userData.isAnimating) return;
      
      const scale = originalScale + Math.sin(Date.now() * 0.01) * 0.2;
      object.scale.setScalar(scale);
      object.rotation.y += 0.01;
      
      if (Date.now() % 3000 < 100) {
        object.userData.isAnimating = false;
        object.scale.setScalar(originalScale);
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  createClickEffect(position) {
    // Create a burst effect at click position
    const geometry = new THREE.SphereGeometry(0.1, 8, 6);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xFFFFFF, 
      transparent: true, 
      opacity: 0.8 
    });
    
    const effect = new THREE.Mesh(geometry, material);
    effect.position.copy(position);
    effect.position.y += 1;
    
    this.scene.add(effect);
    
    // Animate the effect
    const animate = () => {
      effect.scale.multiplyScalar(1.1);
      effect.material.opacity *= 0.9;
      
      if (effect.material.opacity < 0.01) {
        this.scene.remove(effect);
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  regenerateObjects() {
    console.log('Regenerating objects...');
    this.generateObjects();
  }

  clearObjects() {
    this.objects.forEach(obj => {
      this.scene.remove(obj);
    });
    
    this.particleSystems.forEach(ps => {
      this.scene.remove(ps);
    });
    
    this.objects = [];
    this.particleSystems = [];
    this.selectedObject = null;
  }

  toggleSimulation() {
    this.isRunning = !this.isRunning;
    console.log(`Simulation ${this.isRunning ? 'started' : 'stopped'}`);
  }

  update(deltaTime) {
    if (!this.isRunning) return;
    
    this.frameCount++;
    const now = performance.now();
    
    // Performance optimizations
    this.performanceOptimizer.updateVisibility(this.camera, this.objects);
    this.performanceOptimizer.applyLOD(this.camera, this.objects);
    this.performanceOptimizer.batchUpdateObjects(this.objects, deltaTime);
    this.performanceOptimizer.optimizeParticleSystems(this.particleSystems, this.camera);
    this.performanceOptimizer.cleanupUnusedObjects(this.objects);
    
    // Update particle systems
    this.particleSystems.forEach(ps => {
      if (ps.visible) {
        ps.rotation.y += 0.01;
        ps.rotation.x += 0.005;
      }
    });
    
    // Update FPS counter every second
    if (now - this.lastFPSUpdate >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFPSUpdate));
      this.lastFPSUpdate = now;
      this.frameCount = 0;
      
      // Update FPS display if element exists
      const fpsElement = document.getElementById('fps-counter');
      if (fpsElement) {
        fpsElement.textContent = `FPS: ${fps}`;
      }
    }
  }


  getObjectCount() {
    return this.objects.length;
  }

  getActiveObjects() {
    return this.objects.filter(obj => obj.userData.isAnimating);
  }

  getPerformanceStats() {
    const stats = this.performanceOptimizer.getPerformanceStats();
    stats.totalObjects = this.objects.length;
    stats.activeObjects = this.getActiveObjects().length;
    stats.particleSystems = this.particleSystems.length;
    return stats;
  }

  dispose() {
    this.clearObjects();
    this.renderer.domElement.removeEventListener('click', this.onMouseClick);
    this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('keydown', this.onKeyDown);
  }
}