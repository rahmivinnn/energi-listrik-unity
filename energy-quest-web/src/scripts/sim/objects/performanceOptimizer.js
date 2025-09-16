import * as THREE from 'three';

/**
 * Performance optimization utilities for handling 50+ objects
 */
export class PerformanceOptimizer {
  constructor() {
    this.frustum = new THREE.Frustum();
    this.cameraMatrix = new THREE.Matrix4();
    this.visibleObjects = new Set();
    this.updateInterval = 100; // Update visibility every 100ms
    this.lastUpdate = 0;
    this.lodLevels = 3;
  }

  /**
   * Update object visibility based on camera frustum
   */
  updateVisibility(camera, objects) {
    const now = performance.now();
    if (now - this.lastUpdate < this.updateInterval) {
      return;
    }
    
    this.lastUpdate = now;
    this.cameraMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.cameraMatrix);
    
    objects.forEach(obj => {
      const isVisible = this.frustum.intersectsObject(obj);
      obj.visible = isVisible;
      
      if (isVisible) {
        this.visibleObjects.add(obj);
      } else {
        this.visibleObjects.delete(obj);
      }
    });
  }

  /**
   * Apply Level of Detail (LOD) based on distance from camera
   */
  applyLOD(camera, objects) {
    const cameraPosition = camera.position;
    
    objects.forEach(obj => {
      const distance = cameraPosition.distanceTo(obj.position);
      const lodLevel = this.calculateLODLevel(distance);
      
      this.setObjectLOD(obj, lodLevel);
    });
  }

  calculateLODLevel(distance) {
    if (distance < 10) return 0; // High detail
    if (distance < 25) return 1; // Medium detail
    return 2; // Low detail
  }

  setObjectLOD(object, lodLevel) {
    switch (lodLevel) {
      case 0: // High detail
        object.material.wireframe = false;
        object.geometry.computeBoundingSphere();
        break;
      case 1: // Medium detail
        object.material.wireframe = false;
        break;
      case 2: // Low detail
        object.material.wireframe = true;
        break;
    }
  }

  /**
   * Batch update objects for better performance
   */
  batchUpdateObjects(objects, deltaTime) {
    // Group objects by type for batch processing
    const objectGroups = this.groupObjectsByType(objects);
    
    objectGroups.forEach(group => {
      this.updateObjectGroup(group, deltaTime);
    });
  }

  groupObjectsByType(objects) {
    const groups = {};
    
    objects.forEach(obj => {
      const type = obj.userData.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(obj);
    });
    
    return groups;
  }

  updateObjectGroup(objects, deltaTime) {
    // Process objects in batches of 10
    const batchSize = 10;
    const batches = this.chunkArray(objects, batchSize);
    
    batches.forEach(batch => {
      this.processBatch(batch, deltaTime);
    });
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  processBatch(objects, deltaTime) {
    objects.forEach(obj => {
      if (obj.visible && obj.userData.isAnimating) {
        this.updateObjectPhysics(obj, deltaTime);
      }
    });
  }

  updateObjectPhysics(object, deltaTime) {
    const userData = object.userData;
    
    // Apply velocity
    object.position.add(userData.velocity.clone().multiplyScalar(deltaTime));
    
    // Apply rotation
    object.rotation.add(userData.rotationSpeed.clone().multiplyScalar(deltaTime));
    
    // Bounce off ground
    if (object.position.y < 0.5) {
      object.position.y = 0.5;
      userData.velocity.y = Math.abs(userData.velocity.y) * 0.8;
    }
    
    // Bounce off walls
    if (Math.abs(object.position.x) > 25) {
      userData.velocity.x *= -0.8;
      object.position.x = Math.sign(object.position.x) * 25;
    }
    if (Math.abs(object.position.z) > 25) {
      userData.velocity.z *= -0.8;
      object.position.z = Math.sign(object.position.z) * 25;
    }
    
    // Apply gravity
    userData.velocity.y -= 0.01 * deltaTime;
    
    // Apply damping
    userData.velocity.multiplyScalar(0.999);
    userData.rotationSpeed.multiplyScalar(0.99);
  }

  /**
   * Optimize particle systems
   */
  optimizeParticleSystems(particleSystems, camera) {
    const cameraPosition = camera.position;
    
    particleSystems.forEach(ps => {
      const distance = cameraPosition.distanceTo(ps.position);
      
      if (distance > 30) {
        ps.visible = false;
      } else {
        ps.visible = true;
        
        // Reduce particle count based on distance
        const material = ps.material;
        if (distance > 20) {
          material.size = 0.05;
        } else if (distance > 10) {
          material.size = 0.08;
        } else {
          material.size = 0.1;
        }
      }
    });
  }

  /**
   * Memory management
   */
  cleanupUnusedObjects(objects) {
    const now = performance.now();
    
    objects.forEach(obj => {
      // Remove objects that have been inactive for too long
      if (obj.userData.lastActiveTime && now - obj.userData.lastActiveTime > 30000) {
        obj.visible = false;
      }
      
      // Update last active time
      if (obj.userData.isAnimating) {
        obj.userData.lastActiveTime = now;
      }
    });
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats() {
    return {
      visibleObjects: this.visibleObjects.size,
      totalObjects: 0, // Will be set by caller
      fps: 0, // Will be set by caller
      memoryUsage: this.getMemoryUsage()
    };
  }

  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }
}