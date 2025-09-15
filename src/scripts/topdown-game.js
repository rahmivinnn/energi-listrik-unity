// Top-Down Mini Game for Main Menu
class TopDownGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.animationId = null;
        
        // Game state
        this.score = 0;
        this.player = {
            x: 100,
            y: 100,
            size: 20,
            speed: 3,
            color: '#00BFFF',
            trail: [],
            shield: 0,
            magnet: 0,
            speedBoost: 0,
            invulnerable: 0,
            health: 3,
            maxHealth: 3,
            ultimateCharge: 0,
            ultimateMax: 100
        };
        
        this.energyItems = [];
        this.particles = [];
        this.obstacles = [];
        this.powerStations = [];
        this.enemies = [];
        this.powerUps = [];
        this.miniBoss = null;
        this.hazards = [];
        this.combo = 0;
        this.comboMultiplier = 1;
        this.lastCollectionTime = 0;
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        this.difficulty = 1;
        this.gameTime = 0;
        this.achievements = [];
        this.permanentUpgrades = {
            maxHealth: 1,
            speed: 1,
            magnetRange: 1,
            shieldDuration: 1
        };
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            targetZoom: 1,
            shake: 0
        };
        
        // Input handling
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.generateEnergyItems();
        this.generateObstacles();
        this.generatePowerStations();
        this.generateEnemies();
        this.generatePowerUps();
        this.generateHazards();
        this.initializeAchievements();
        this.start();
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('topdown-game-canvas');
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
        
        // Mouse events for camera control
        this.canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            this.handleWheel(e);
        });
    }
    
    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        switch(key) {
            case 'w':
            case 'arrowup':
                this.keys.w = true;
                this.keys.up = true;
                break;
            case 'a':
            case 'arrowleft':
                this.keys.a = true;
                this.keys.left = true;
                break;
            case 's':
            case 'arrowdown':
                this.keys.s = true;
                this.keys.down = true;
                break;
            case 'd':
            case 'arrowright':
                this.keys.d = true;
                this.keys.right = true;
                break;
            case ' ':
                // Spacebar for ultimate ability
                this.useUltimate();
                break;
        }
    }
    
    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        switch(key) {
            case 'w':
            case 'arrowup':
                this.keys.w = false;
                this.keys.up = false;
                break;
            case 'a':
            case 'arrowleft':
                this.keys.a = false;
                this.keys.left = false;
                break;
            case 's':
            case 'arrowdown':
                this.keys.s = false;
                this.keys.down = false;
                break;
            case 'd':
            case 'arrowright':
                this.keys.d = false;
                this.keys.right = false;
                break;
        }
    }
    
    handleMouseMove(e) {
        // Smooth camera follow
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        this.camera.targetX = mouseX - this.canvas.width / 2;
        this.camera.targetY = mouseY - this.canvas.height / 2;
    }
    
    handleWheel(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        this.camera.targetZoom = Math.max(0.5, Math.min(2, this.camera.zoom * zoomFactor));
    }
    
    generateEnergyItems() {
        this.energyItems = [];
        const itemCount = 15;
        
        for (let i = 0; i < itemCount; i++) {
            this.energyItems.push({
                x: Math.random() * (this.canvas.width * 2) - this.canvas.width,
                y: Math.random() * (this.canvas.height * 2) - this.canvas.height,
                size: 8 + Math.random() * 8,
                color: this.getRandomEnergyColor(),
                pulse: Math.random() * Math.PI * 2,
                collected: false,
                value: Math.floor(Math.random() * 3) + 1
            });
        }
    }
    
    getRandomEnergyColor() {
        const colors = ['#FFD700', '#00FF7F', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    generateObstacles() {
        this.obstacles = [];
        const obstacleCount = 8;
        
        for (let i = 0; i < obstacleCount; i++) {
            this.obstacles.push({
                x: Math.random() * (this.canvas.width * 2) - this.canvas.width,
                y: Math.random() * (this.canvas.height * 2) - this.canvas.height,
                width: 30 + Math.random() * 40,
                height: 30 + Math.random() * 40,
                type: Math.random() > 0.5 ? 'energy_waste' : 'broken_circuit',
                rotation: Math.random() * Math.PI * 2,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    generatePowerStations() {
        this.powerStations = [];
        const stationCount = 3;
        
        for (let i = 0; i < stationCount; i++) {
            this.powerStations.push({
                x: Math.random() * (this.canvas.width * 2) - this.canvas.width,
                y: Math.random() * (this.canvas.height * 2) - this.canvas.height,
                size: 40 + Math.random() * 20,
                energy: 100,
                maxEnergy: 100,
                isActive: true,
                pulse: Math.random() * Math.PI * 2,
                lastInteraction: 0
            });
        }
    }
    
    generateEnemies() {
        this.enemies = [];
        const enemyCount = 5;
        
        for (let i = 0; i < enemyCount; i++) {
            this.enemies.push({
                x: Math.random() * (this.canvas.width * 2) - this.canvas.width,
                y: Math.random() * (this.canvas.height * 2) - this.canvas.height,
                size: 15 + Math.random() * 10,
                speed: 1 + Math.random() * 1.5,
                color: '#FF4444',
                health: 3,
                maxHealth: 3,
                lastAttack: 0,
                attackCooldown: 2000,
                type: Math.random() > 0.5 ? 'chaser' : 'patrol',
                patrolTarget: {
                    x: Math.random() * (this.canvas.width * 2) - this.canvas.width,
                    y: Math.random() * (this.canvas.height * 2) - this.canvas.height
                },
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    generatePowerUps() {
        this.powerUps = [];
        const powerUpCount = 3;
        
        for (let i = 0; i < powerUpCount; i++) {
            this.powerUps.push({
                x: Math.random() * (this.canvas.width * 2) - this.canvas.width,
                y: Math.random() * (this.canvas.height * 2) - this.canvas.height,
                size: 12 + Math.random() * 8,
                type: ['shield', 'magnet', 'speed'][Math.floor(Math.random() * 3)],
                duration: 10000, // 10 seconds
                collected: false,
                pulse: Math.random() * Math.PI * 2,
                spawnTime: Date.now()
            });
        }
    }
    
    update() {
        this.updatePlayer();
        this.updateCamera();
        this.updateEnergyItems();
        this.updateObstacles();
        this.updatePowerStations();
        this.updateEnemies();
        this.updatePowerUps();
        this.updateMiniBoss();
        this.updateHazards();
        this.updateParticles();
        this.updatePlayerEffects();
        this.updateGameTime();
        this.updateDifficulty();
        this.checkAchievements();
        this.updateUltimateCharge();
    }
    
    updatePlayer() {
        // Movement with speed boost
        let baseSpeed = this.player.speed;
        if (this.player.speedBoost > 0) {
            baseSpeed *= 2;
        }
        
        let dx = 0;
        let dy = 0;
        
        if (this.keys.w || this.keys.up) dy -= baseSpeed;
        if (this.keys.s || this.keys.down) dy += baseSpeed;
        if (this.keys.a || this.keys.left) dx -= baseSpeed;
        if (this.keys.d || this.keys.right) dx += baseSpeed;
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }
        
        this.player.x += dx;
        this.player.y += dy;
        
        // Keep player in bounds (with some margin)
        const margin = 50;
        this.player.x = Math.max(margin, Math.min(this.canvas.width * 2 - margin, this.player.x));
        this.player.y = Math.max(margin, Math.min(this.canvas.height * 2 - margin, this.player.y));
        
        // Add to trail
        this.player.trail.push({ x: this.player.x, y: this.player.y });
        if (this.player.trail.length > 20) {
            this.player.trail.shift();
        }
        
        // Magnet effect - attract nearby energy items
        if (this.player.magnet > 0) {
            this.energyItems.forEach(item => {
                if (item.collected) return;
                
                const dx = this.player.x - item.x;
                const dy = this.player.y - item.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) { // Magnet range
                    const magnetForce = 0.3;
                    item.x += (dx / distance) * magnetForce;
                    item.y += (dy / distance) * magnetForce;
                }
            });
        }
    }
    
    updateCamera() {
        // Smooth camera movement
        this.camera.x += (this.player.x - this.canvas.width / 2 - this.camera.x) * 0.05;
        this.camera.y += (this.player.y - this.canvas.height / 2 - this.camera.y) * 0.05;
        
        // Smooth zoom
        this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.05;
        
        // Camera shake effect
        if (this.camera.shake > 0) {
            this.camera.x += (Math.random() - 0.5) * this.camera.shake;
            this.camera.y += (Math.random() - 0.5) * this.camera.shake;
            this.camera.shake *= 0.9;
        }
    }
    
    updateEnergyItems() {
        this.energyItems.forEach(item => {
            if (item.collected) return;
            
            item.pulse += 0.1;
            
            // Check collision with player
            const dx = item.x - this.player.x;
            const dy = item.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.player.size + item.size) {
                this.collectEnergyItem(item);
            }
        });
    }
    
    collectEnergyItem(item) {
        item.collected = true;
        
        // Combo system
        const now = Date.now();
        if (now - this.lastCollectionTime < 2000) { // Within 2 seconds
            this.combo++;
            this.comboMultiplier = Math.min(5, 1 + this.combo * 0.5);
        } else {
            this.combo = 1;
            this.comboMultiplier = 1;
        }
        this.lastCollectionTime = now;
        
        this.score += Math.floor(item.value * this.comboMultiplier);
        this.addExperience(item.value * 2);
        this.player.ultimateCharge += item.value * 2;
        if (this.player.ultimateCharge > this.player.ultimateMax) {
            this.player.ultimateCharge = this.player.ultimateMax;
        }
        this.updateScore();
        
        // Create collection particles
        this.createCollectionParticles(item.x, item.y, item.color);
        
        // Play collection sound
        this.playCollectionSound();
        
        // Add screen shake effect
        this.camera.shake = 5;
        
        // Regenerate items if all collected
        if (this.energyItems.every(item => item.collected)) {
            setTimeout(() => {
                this.generateEnergyItems();
            }, 1000);
        }
    }
    
    collectPowerUp(powerUp) {
        powerUp.collected = true;
        
        switch(powerUp.type) {
            case 'shield':
                this.player.shield = powerUp.duration;
                this.createShieldEffect();
                break;
            case 'magnet':
                this.player.magnet = powerUp.duration;
                this.createMagnetEffect();
                break;
            case 'speed':
                this.player.speedBoost = powerUp.duration;
                this.createSpeedEffect();
                break;
        }
        
        // Create collection particles
        this.createPowerUpParticles(powerUp.x, powerUp.y, powerUp.type);
        
        // Play power-up sound
        this.playPowerUpSound();
        
        // Regenerate power-ups
        setTimeout(() => {
            this.generatePowerUps();
        }, 2000);
    }
    
    playerHitByEnemy(enemy) {
        if (this.player.shield > 0) {
            // Shield absorbs damage
            this.player.shield = 0;
            this.createShieldBreakEffect();
        } else {
            // Take damage
            this.player.invulnerable = 2000; // 2 seconds invulnerability
            this.camera.shake = 10;
            this.createDamageEffect();
            this.playDamageSound();
        }
        
        // Push player away
        const dx = this.player.x - enemy.x;
        const dy = this.player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.player.x += (dx / distance) * 30;
            this.player.y += (dy / distance) * 30;
        }
    }
    
    playerHitByMiniBoss() {
        if (this.player.shield > 0) {
            this.player.shield = 0;
            this.createShieldBreakEffect();
        } else {
            this.player.invulnerable = 3000; // 3 seconds invulnerability
            this.camera.shake = 15;
            this.createDamageEffect();
            this.playDamageSound();
        }
        
        // Push player away
        const dx = this.player.x - this.miniBoss.x;
        const dy = this.player.y - this.miniBoss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.player.x += (dx / distance) * 50;
            this.player.y += (dy / distance) * 50;
        }
    }
    
    spawnMiniBoss() {
        this.miniBoss = {
            x: Math.random() * (this.canvas.width * 2) - this.canvas.width,
            y: Math.random() * (this.canvas.height * 2) - this.canvas.height,
            size: 40,
            speed: 0.8,
            health: 10,
            maxHealth: 10,
            pulse: 0,
            color: '#8B0000'
        };
        
        this.createMiniBossSpawnEffect();
        this.playMiniBossSound();
    }
    
    createCollectionParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1,
                decay: 0.02,
                size: 3 + Math.random() * 3,
                color: color
            });
        }
    }
    
    createPowerUpParticles(x, y, type) {
        const colors = {
            'shield': '#00BFFF',
            'magnet': '#FFD700',
            'speed': '#FF6B6B'
        };
        
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
                decay: 0.015,
                size: 4 + Math.random() * 4,
                color: colors[type]
            });
        }
    }
    
    createShieldEffect() {
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                decay: 0.01,
                size: 5 + Math.random() * 5,
                color: '#00BFFF'
            });
        }
    }
    
    createMagnetEffect() {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
                decay: 0.012,
                size: 3 + Math.random() * 3,
                color: '#FFD700'
            });
        }
    }
    
    createSpeedEffect() {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                decay: 0.02,
                size: 2 + Math.random() * 2,
                color: '#FF6B6B'
            });
        }
    }
    
    createShieldBreakEffect() {
        for (let i = 0; i < 25; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 1,
                decay: 0.03,
                size: 4 + Math.random() * 4,
                color: '#00BFFF'
            });
        }
    }
    
    createDamageEffect() {
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 1,
                decay: 0.04,
                size: 3 + Math.random() * 3,
                color: '#FF4444'
            });
        }
    }
    
    createMiniBossSpawnEffect() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: this.miniBoss.x,
                y: this.miniBoss.y,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                life: 1,
                decay: 0.01,
                size: 6 + Math.random() * 6,
                color: '#8B0000'
            });
        }
    }
    
    createLevelUpEffect() {
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                decay: 0.01,
                size: 5 + Math.random() * 5,
                color: '#FFD700'
            });
        }
    }
    
    createAchievementEffect(achievement) {
        for (let i = 0; i < 25; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                decay: 0.015,
                size: 4 + Math.random() * 4,
                color: '#00FF7F'
            });
        }
    }
    
    createUltimateEffect() {
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 25,
                vy: (Math.random() - 0.5) * 25,
                life: 1,
                decay: 0.02,
                size: 8 + Math.random() * 8,
                color: '#FF00FF'
            });
        }
    }
    
    createDifficultyIncreaseEffect() {
        for (let i = 0; i < 40; i++) {
            this.particles.push({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 1,
                decay: 0.01,
                size: 6 + Math.random() * 6,
                color: '#FF4500'
            });
        }
    }
    
    createEnergyDrainEffect() {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                decay: 0.02,
                size: 3 + Math.random() * 3,
                color: '#FF4500'
            });
        }
    }
    
    createSlowFieldEffect() {
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
                decay: 0.015,
                size: 4 + Math.random() * 4,
                color: '#4169E1'
            });
        }
    }
    
    updateObstacles() {
        this.obstacles.forEach(obstacle => {
            obstacle.pulse += 0.05;
            
            // Check collision with player
            const dx = obstacle.x - this.player.x;
            const dy = obstacle.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.player.size + Math.max(obstacle.width, obstacle.height) / 2) {
                // Slow down player when near obstacles
                this.player.speed = 1.5;
                
                // Play warning sound occasionally
                if (Math.random() < 0.01) {
                    this.playObstacleWarningSound();
                }
            } else {
                this.player.speed = 3;
            }
        });
    }
    
    updatePowerStations() {
        this.powerStations.forEach(station => {
            station.pulse += 0.03;
            
            // Check interaction with player
            const dx = station.x - this.player.x;
            const dy = station.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.player.size + station.size && station.isActive) {
                const now = Date.now();
                if (now - station.lastInteraction > 2000) { // 2 second cooldown
                    this.interactWithPowerStation(station);
                    station.lastInteraction = now;
                }
            }
        });
    }
    
    interactWithPowerStation(station) {
        if (station.energy > 0) {
            station.energy -= 20;
            this.score += 5;
            this.updateScore();
            
            // Create energy boost particles
            this.createEnergyBoostParticles(station.x, station.y);
            
            // Play power station sound
            this.playPowerStationSound();
            
            if (station.energy <= 0) {
                station.isActive = false;
                // Regenerate after 10 seconds
                setTimeout(() => {
                    station.energy = station.maxEnergy;
                    station.isActive = true;
                }, 10000);
            }
        }
    }
    
    createEnergyBoostParticles(x, y) {
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
                decay: 0.015,
                size: 4 + Math.random() * 4,
                color: '#00BFFF'
            });
        }
    }
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            enemy.pulse += 0.1;
            
            if (enemy.type === 'chaser') {
                // Chase player
                const dx = this.player.x - enemy.x;
                const dy = this.player.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    enemy.x += (dx / distance) * enemy.speed;
                    enemy.y += (dy / distance) * enemy.speed;
                }
            } else {
                // Patrol behavior
                const dx = enemy.patrolTarget.x - enemy.x;
                const dy = enemy.patrolTarget.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 50) {
                    // Get new patrol target
                    enemy.patrolTarget.x = Math.random() * (this.canvas.width * 2) - this.canvas.width;
                    enemy.patrolTarget.y = Math.random() * (this.canvas.height * 2) - this.canvas.height;
                } else if (distance > 0) {
                    enemy.x += (dx / distance) * enemy.speed * 0.5;
                    enemy.y += (dy / distance) * enemy.speed * 0.5;
                }
            }
            
            // Check collision with player
            const dx = enemy.x - this.player.x;
            const dy = enemy.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.player.size + enemy.size && this.player.invulnerable <= 0) {
                this.playerHitByEnemy(enemy);
            }
        });
    }
    
    updatePowerUps() {
        this.powerUps.forEach(powerUp => {
            if (powerUp.collected) return;
            
            powerUp.pulse += 0.15;
            
            // Check collision with player
            const dx = powerUp.x - this.player.x;
            const dy = powerUp.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.player.size + powerUp.size) {
                this.collectPowerUp(powerUp);
            }
        });
    }
    
    updateMiniBoss() {
        // Spawn mini-boss every 30 seconds if score is high enough
        if (this.score > 50 && !this.miniBoss && Math.random() < 0.001) {
            this.spawnMiniBoss();
        }
        
        if (this.miniBoss) {
            this.miniBoss.pulse += 0.05;
            
            // Mini-boss AI - move towards player but slower
            const dx = this.player.x - this.miniBoss.x;
            const dy = this.player.y - this.miniBoss.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                this.miniBoss.x += (dx / distance) * this.miniBoss.speed;
                this.miniBoss.y += (dy / distance) * this.miniBoss.speed;
            }
            
            // Check collision with player
            if (distance < this.player.size + this.miniBoss.size && this.player.invulnerable <= 0) {
                this.playerHitByMiniBoss();
            }
        }
    }
    
    updatePlayerEffects() {
        const now = Date.now();
        
        // Update power-up timers
        if (this.player.shield > 0) {
            this.player.shield -= 16; // Assuming 60fps
            if (this.player.shield <= 0) this.player.shield = 0;
        }
        
        if (this.player.magnet > 0) {
            this.player.magnet -= 16;
            if (this.player.magnet <= 0) this.player.magnet = 0;
        }
        
        if (this.player.speedBoost > 0) {
            this.player.speedBoost -= 16;
            if (this.player.speedBoost <= 0) this.player.speedBoost = 0;
        }
        
        if (this.player.invulnerable > 0) {
            this.player.invulnerable -= 16;
            if (this.player.invulnerable <= 0) this.player.invulnerable = 0;
        }
        
        // Update combo system
        if (now - this.lastCollectionTime > 2000) { // 2 seconds
            this.combo = 0;
            this.comboMultiplier = 1;
        }
    }
    
    updateGameTime() {
        this.gameTime += 16; // Assuming 60fps
    }
    
    updateDifficulty() {
        // Increase difficulty every 30 seconds
        const newDifficulty = Math.floor(this.gameTime / 30000) + 1;
        if (newDifficulty > this.difficulty) {
            this.difficulty = newDifficulty;
            this.onDifficultyIncrease();
        }
    }
    
    addExperience(amount) {
        this.experience += amount;
        if (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.experience -= this.experienceToNext;
        this.experienceToNext = Math.floor(this.experienceToNext * 1.2);
        
        // Apply permanent upgrades
        this.player.speed = 3 + (this.permanentUpgrades.speed - 1) * 0.5;
        
        this.createLevelUpEffect();
        this.playLevelUpSound();
        this.updateLevelDisplay();
    }
    
    onDifficultyIncrease() {
        // Spawn more enemies
        this.generateEnemies();
        
        // Increase enemy speed
        this.enemies.forEach(enemy => {
            enemy.speed += 0.2;
        });
        
        // Spawn more energy items
        this.generateEnergyItems();
        
        this.createDifficultyIncreaseEffect();
    }
    
    generateHazards() {
        this.hazards = [];
        const hazardCount = 4;
        
        for (let i = 0; i < hazardCount; i++) {
            this.hazards.push({
                x: Math.random() * (this.canvas.width * 2) - this.canvas.width,
                y: Math.random() * (this.canvas.height * 2) - this.canvas.height,
                size: 30 + Math.random() * 20,
                type: ['energy_drain', 'slow_field', 'damage_zone'][Math.floor(Math.random() * 3)],
                active: true,
                pulse: Math.random() * Math.PI * 2,
                damage: 0.5,
                lastDamage: 0
            });
        }
    }
    
    updateHazards() {
        this.hazards.forEach(hazard => {
            hazard.pulse += 0.08;
            
            // Check collision with player
            const dx = hazard.x - this.player.x;
            const dy = hazard.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.player.size + hazard.size && hazard.active) {
                this.playerHitByHazard(hazard);
            }
        });
    }
    
    playerHitByHazard(hazard) {
        const now = Date.now();
        
        if (now - hazard.lastDamage > 1000) { // 1 second cooldown
            hazard.lastDamage = now;
            
            switch(hazard.type) {
                case 'energy_drain':
                    // Drain ultimate charge
                    this.player.ultimateCharge = Math.max(0, this.player.ultimateCharge - 10);
                    this.createEnergyDrainEffect();
                    break;
                case 'slow_field':
                    // Slow down player
                    this.player.speed = Math.max(1, this.player.speed * 0.5);
                    setTimeout(() => {
                        this.player.speed = 3 + (this.permanentUpgrades.speed - 1) * 0.5;
                    }, 3000);
                    this.createSlowFieldEffect();
                    break;
                case 'damage_zone':
                    // Deal damage
                    if (this.player.shield > 0) {
                        this.player.shield = 0;
                        this.createShieldBreakEffect();
                    } else {
                        this.player.invulnerable = 1000;
                        this.camera.shake = 8;
                        this.createDamageEffect();
                        this.playDamageSound();
                    }
                    break;
            }
        }
    }
    
    initializeAchievements() {
        this.achievements = [
            { id: 'first_energy', name: 'First Energy', description: 'Kumpulkan energy pertama', unlocked: false, condition: () => this.score >= 1 },
            { id: 'combo_master', name: 'Combo Master', description: 'Dapatkan combo x5', unlocked: false, condition: () => this.combo >= 5 },
            { id: 'level_5', name: 'Rising Star', description: 'Capai level 5', unlocked: false, condition: () => this.level >= 5 },
            { id: 'survivor', name: 'Survivor', description: 'Bertahan 2 menit', unlocked: false, condition: () => this.gameTime >= 120000 },
            { id: 'energy_hunter', name: 'Energy Hunter', description: 'Kumpulkan 100 energy', unlocked: false, condition: () => this.score >= 100 },
            { id: 'boss_slayer', name: 'Boss Slayer', description: 'Kalahkan mini-boss', unlocked: false, condition: () => this.miniBoss && this.miniBoss.health <= 0 },
            { id: 'ultimate_master', name: 'Ultimate Master', description: 'Gunakan ultimate ability', unlocked: false, condition: () => this.player.ultimateCharge >= this.player.ultimateMax }
        ];
    }
    
    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.condition()) {
                this.unlockAchievement(achievement);
            }
        });
    }
    
    unlockAchievement(achievement) {
        achievement.unlocked = true;
        this.createAchievementEffect(achievement);
        this.playAchievementSound();
        this.showAchievementNotification(achievement);
    }
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(145deg, rgba(0, 200, 100, 0.95), rgba(0, 150, 75, 0.95));
            border: 3px solid rgba(0, 255, 127, 0.8);
            border-radius: 20px;
            padding: 20px 30px;
            backdrop-filter: blur(20px);
            color: white;
            font-family: 'Orbitron', sans-serif;
            text-align: center;
            z-index: 1000;
            box-shadow: 0 0 30px rgba(0, 255, 127, 0.6);
            animation: achievementSlideIn 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 1.5rem; margin-bottom: 10px;">🏆 ACHIEVEMENT UNLOCKED! 🏆</div>
            <div style="font-size: 1.2rem; font-weight: 700; margin-bottom: 5px;">${achievement.name}</div>
            <div style="font-size: 1rem; opacity: 0.9;">${achievement.description}</div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes achievementSlideIn {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'achievementSlideIn 0.5s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 500);
        }, 3000);
    }
    
    useUltimate() {
        if (this.player.ultimateCharge >= this.player.ultimateMax) {
            this.player.ultimateCharge = 0;
            this.createUltimateEffect();
            this.playUltimateSound();
            
            // Ultimate effect: Clear all enemies and collect all energy
            this.enemies = [];
            this.energyItems.forEach(item => {
                if (!item.collected) {
                    this.collectEnergyItem(item);
                }
            });
            
            // Add ultimate charge when collecting energy
            this.player.ultimateCharge += 5;
            if (this.player.ultimateCharge > this.player.ultimateMax) {
                this.player.ultimateCharge = this.player.ultimateMax;
            }
        }
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            return particle.life > 0;
        });
    }
    
    updateScore() {
        const scoreElement = document.getElementById('energy-score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
        
        // Update combo display
        this.updateComboDisplay();
        this.updatePowerUpDisplay();
        this.updateLevelDisplay();
        this.updateUltimateDisplay();
    }
    
    updateComboDisplay() {
        let comboElement = document.getElementById('combo-display');
        if (!comboElement) {
            comboElement = document.createElement('div');
            comboElement.id = 'combo-display';
            comboElement.style.cssText = `
                position: fixed;
                top: 80px;
                left: 20px;
                background: linear-gradient(145deg, rgba(255, 100, 100, 0.8), rgba(200, 50, 50, 0.9));
                border: 2px solid rgba(255, 150, 150, 0.6);
                border-radius: 25px;
                padding: 12px 20px;
                backdrop-filter: blur(10px);
                color: white;
                font-family: 'Orbitron', sans-serif;
                font-size: 1.2rem;
                font-weight: 700;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                z-index: 10;
                display: none;
            `;
            document.body.appendChild(comboElement);
        }
        
        if (this.combo > 1) {
            comboElement.style.display = 'block';
            comboElement.textContent = `COMBO x${this.comboMultiplier.toFixed(1)}`;
        } else {
            comboElement.style.display = 'none';
        }
    }
    
    updatePowerUpDisplay() {
        let powerUpElement = document.getElementById('powerup-display');
        if (!powerUpElement) {
            powerUpElement = document.createElement('div');
            powerUpElement.id = 'powerup-display';
            powerUpElement.style.cssText = `
                position: fixed;
                top: 130px;
                left: 20px;
                background: linear-gradient(145deg, rgba(0, 100, 200, 0.8), rgba(0, 50, 150, 0.9));
                border: 2px solid rgba(0, 191, 255, 0.6);
                border-radius: 25px;
                padding: 12px 20px;
                backdrop-filter: blur(10px);
                color: white;
                font-family: 'Rajdhani', sans-serif;
                font-size: 1rem;
                font-weight: 600;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
                z-index: 10;
                display: none;
            `;
            document.body.appendChild(powerUpElement);
        }
        
        const activePowerUps = [];
        if (this.player.shield > 0) activePowerUps.push('🛡️ Shield');
        if (this.player.magnet > 0) activePowerUps.push('🧲 Magnet');
        if (this.player.speedBoost > 0) activePowerUps.push('⚡ Speed');
        
        if (activePowerUps.length > 0) {
            powerUpElement.style.display = 'block';
            powerUpElement.textContent = activePowerUps.join(' | ');
        } else {
            powerUpElement.style.display = 'none';
        }
    }
    
    updateLevelDisplay() {
        let levelElement = document.getElementById('level-display');
        if (!levelElement) {
            levelElement = document.createElement('div');
            levelElement.id = 'level-display';
            levelElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(145deg, rgba(100, 50, 200, 0.8), rgba(150, 100, 250, 0.9));
                border: 2px solid rgba(200, 100, 255, 0.6);
                border-radius: 25px;
                padding: 12px 20px;
                backdrop-filter: blur(10px);
                color: white;
                font-family: 'Orbitron', sans-serif;
                font-size: 1.2rem;
                font-weight: 700;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                z-index: 10;
            `;
            document.body.appendChild(levelElement);
        }
        
        const expPercent = (this.experience / this.experienceToNext) * 100;
        levelElement.innerHTML = `
            <div>Level ${this.level}</div>
            <div style="font-size: 0.8rem; margin-top: 5px;">
                <div style="background: rgba(0,0,0,0.3); border-radius: 10px; height: 8px; width: 100px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #00FF7F, #00BFFF); height: 100%; width: ${expPercent}%; transition: width 0.3s ease;"></div>
                </div>
                <div style="font-size: 0.7rem; margin-top: 2px;">${this.experience}/${this.experienceToNext} XP</div>
            </div>
        `;
    }
    
    updateUltimateDisplay() {
        let ultimateElement = document.getElementById('ultimate-display');
        if (!ultimateElement) {
            ultimateElement = document.createElement('div');
            ultimateElement.id = 'ultimate-display';
            ultimateElement.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: linear-gradient(145deg, rgba(200, 50, 200, 0.8), rgba(250, 100, 250, 0.9));
                border: 2px solid rgba(255, 100, 255, 0.6);
                border-radius: 25px;
                padding: 12px 20px;
                backdrop-filter: blur(10px);
                color: white;
                font-family: 'Orbitron', sans-serif;
                font-size: 1rem;
                font-weight: 700;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                z-index: 10;
            `;
            document.body.appendChild(ultimateElement);
        }
        
        const ultimatePercent = (this.player.ultimateCharge / this.player.ultimateMax) * 100;
        const isReady = this.player.ultimateCharge >= this.player.ultimateMax;
        
        ultimateElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 1.5rem;">⚡</div>
                <div>
                    <div style="font-size: 0.9rem;">Ultimate</div>
                    <div style="background: rgba(0,0,0,0.3); border-radius: 10px; height: 8px; width: 100px; overflow: hidden; margin-top: 3px;">
                        <div style="background: linear-gradient(90deg, #FF00FF, #FF69B4); height: 100%; width: ${ultimatePercent}%; transition: width 0.3s ease; ${isReady ? 'box-shadow: 0 0 10px #FF00FF;' : ''}"></div>
                    </div>
                    <div style="font-size: 0.7rem; margin-top: 2px;">${Math.floor(ultimatePercent)}%</div>
                </div>
            </div>
        `;
        
        if (isReady) {
            ultimateElement.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.8)';
        } else {
            ultimateElement.style.boxShadow = 'none';
        }
    }
    
    playCollectionSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    playPowerStationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    playObstacleWarningSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    playPowerUpSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2);
            oscillator.frequency.exponentialRampToValueAtTime(1800, audioContext.currentTime + 0.4);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    playDamageSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    playMiniBossSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.4);
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.6);
            
            gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.8);
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    playLevelUpSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.6);
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.8);
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    playAchievementSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    playUltimateSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.4);
            oscillator.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + 0.6);
            
            gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1.0);
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    render() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context
        this.ctx.save();
        
        // Apply camera transform
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        
        // Draw background grid
        this.drawGrid();
        
        // Draw obstacles
        this.drawObstacles();
        
        // Draw power stations
        this.drawPowerStations();
        
        // Draw enemies
        this.drawEnemies();
        
        // Draw power-ups
        this.drawPowerUps();
        
        // Draw mini-boss
        this.drawMiniBoss();
        
        // Draw hazards
        this.drawHazards();
        
        // Draw energy items
        this.drawEnergyItems();
        
        // Draw player trail
        this.drawPlayerTrail();
        
        // Draw player
        this.drawPlayer();
        
        // Draw particles
        this.drawParticles();
        
        // Restore context
        this.ctx.restore();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 191, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        const startX = Math.floor(this.camera.x / gridSize) * gridSize;
        const startY = Math.floor(this.camera.y / gridSize) * gridSize;
        
        for (let x = startX; x < this.camera.x + this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.camera.y);
            this.ctx.lineTo(x, this.camera.y + this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = startY; y < this.camera.y + this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.camera.x, y);
            this.ctx.lineTo(this.camera.x + this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            this.ctx.save();
            this.ctx.translate(obstacle.x, obstacle.y);
            this.ctx.rotate(obstacle.rotation + obstacle.pulse * 0.1);
            
            const pulseScale = 1 + Math.sin(obstacle.pulse) * 0.1;
            this.ctx.scale(pulseScale, pulseScale);
            
            if (obstacle.type === 'energy_waste') {
                // Draw energy waste obstacle
                this.ctx.fillStyle = 'rgba(255, 100, 100, 0.7)';
                this.ctx.shadowColor = '#FF6464';
                this.ctx.shadowBlur = 10;
                
                this.ctx.fillRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
                
                // Inner pattern
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = 'rgba(255, 200, 200, 0.5)';
                this.ctx.fillRect(-obstacle.width/3, -obstacle.height/3, obstacle.width/1.5, obstacle.height/1.5);
            } else {
                // Draw broken circuit obstacle
                this.ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
                this.ctx.lineWidth = 3;
                this.ctx.shadowColor = '#FFA500';
                this.ctx.shadowBlur = 8;
                
                this.ctx.beginPath();
                this.ctx.moveTo(-obstacle.width/2, -obstacle.height/2);
                this.ctx.lineTo(obstacle.width/2, -obstacle.height/2);
                this.ctx.lineTo(obstacle.width/2, obstacle.height/2);
                this.ctx.lineTo(-obstacle.width/2, obstacle.height/2);
                this.ctx.closePath();
                this.ctx.stroke();
                
                // Circuit pattern
                this.ctx.shadowBlur = 0;
                this.ctx.strokeStyle = 'rgba(255, 200, 100, 0.6)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(-obstacle.width/4, -obstacle.height/4);
                this.ctx.lineTo(obstacle.width/4, obstacle.height/4);
                this.ctx.moveTo(obstacle.width/4, -obstacle.height/4);
                this.ctx.lineTo(-obstacle.width/4, obstacle.height/4);
                this.ctx.stroke();
            }
            
            this.ctx.restore();
        });
    }
    
    drawPowerStations() {
        this.powerStations.forEach(station => {
            const pulseSize = station.size + Math.sin(station.pulse) * 3;
            const energyRatio = station.energy / station.maxEnergy;
            
            // Station glow
            this.ctx.shadowColor = station.isActive ? '#00BFFF' : '#666666';
            this.ctx.shadowBlur = 20;
            
            // Station body
            this.ctx.fillStyle = station.isActive ? 
                `rgba(0, 191, 255, ${0.3 + energyRatio * 0.4})` : 
                'rgba(100, 100, 100, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(station.x, station.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Energy level indicator
            this.ctx.shadowBlur = 0;
            this.ctx.strokeStyle = station.isActive ? '#00BFFF' : '#666666';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(station.x, station.y, pulseSize * 0.8, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Energy bar
            if (station.isActive) {
                this.ctx.fillStyle = `hsl(${120 * energyRatio}, 70%, 50%)`;
                this.ctx.fillRect(station.x - pulseSize/2, station.y - pulseSize - 10, pulseSize * energyRatio, 4);
            }
            
            // Station core
            this.ctx.fillStyle = station.isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(150, 150, 150, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(station.x, station.y, pulseSize * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawEnergyItems() {
        this.energyItems.forEach(item => {
            if (item.collected) return;
            
            const pulseSize = item.size + Math.sin(item.pulse) * 2;
            
            // Glow effect
            this.ctx.shadowColor = item.color;
            this.ctx.shadowBlur = 15;
            
            // Draw energy item
            this.ctx.fillStyle = item.color;
            this.ctx.beginPath();
            this.ctx.arc(item.x, item.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Inner glow
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(item.x, item.y, pulseSize * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawPlayerTrail() {
        if (this.player.trail.length < 2) return;
        
        this.ctx.strokeStyle = 'rgba(0, 191, 255, 0.3)';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.trail[0].x, this.player.trail[0].y);
        
        for (let i = 1; i < this.player.trail.length; i++) {
            this.ctx.lineTo(this.player.trail[i].x, this.player.trail[i].y);
        }
        
        this.ctx.stroke();
    }
    
    drawEnemies() {
        this.enemies.forEach(enemy => {
            const pulseSize = enemy.size + Math.sin(enemy.pulse) * 2;
            
            // Enemy glow
            this.ctx.shadowColor = enemy.color;
            this.ctx.shadowBlur = 15;
            
            // Enemy body
            this.ctx.fillStyle = enemy.color;
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Enemy eyes
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(enemy.x - pulseSize/3, enemy.y - pulseSize/3, pulseSize/4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(enemy.x + pulseSize/3, enemy.y - pulseSize/3, pulseSize/4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Health bar
            if (enemy.health < enemy.maxHealth) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(enemy.x - pulseSize, enemy.y - pulseSize - 8, pulseSize * 2, 4);
                this.ctx.fillStyle = '#FF4444';
                this.ctx.fillRect(enemy.x - pulseSize, enemy.y - pulseSize - 8, (pulseSize * 2) * (enemy.health / enemy.maxHealth), 4);
            }
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            if (powerUp.collected) return;
            
            const pulseSize = powerUp.size + Math.sin(powerUp.pulse) * 3;
            const colors = {
                'shield': '#00BFFF',
                'magnet': '#FFD700',
                'speed': '#FF6B6B'
            };
            
            // Power-up glow
            this.ctx.shadowColor = colors[powerUp.type];
            this.ctx.shadowBlur = 20;
            
            // Power-up body
            this.ctx.fillStyle = colors[powerUp.type];
            this.ctx.beginPath();
            this.ctx.arc(powerUp.x, powerUp.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Power-up symbol
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = `${pulseSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            let symbol = '';
            switch(powerUp.type) {
                case 'shield': symbol = '🛡️'; break;
                case 'magnet': symbol = '🧲'; break;
                case 'speed': symbol = '⚡'; break;
            }
            
            this.ctx.fillText(symbol, powerUp.x, powerUp.y);
        });
    }
    
    drawMiniBoss() {
        if (!this.miniBoss) return;
        
        const pulseSize = this.miniBoss.size + Math.sin(this.miniBoss.pulse) * 5;
        
        // Mini-boss glow
        this.ctx.shadowColor = this.miniBoss.color;
        this.ctx.shadowBlur = 30;
        
        // Mini-boss body
        this.ctx.fillStyle = this.miniBoss.color;
        this.ctx.beginPath();
        this.ctx.arc(this.miniBoss.x, this.miniBoss.y, pulseSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Mini-boss inner circle
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(this.miniBoss.x, this.miniBoss.y, pulseSize * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Health bar
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(this.miniBoss.x - pulseSize, this.miniBoss.y - pulseSize - 12, pulseSize * 2, 6);
        this.ctx.fillStyle = '#8B0000';
        this.ctx.fillRect(this.miniBoss.x - pulseSize, this.miniBoss.y - pulseSize - 12, (pulseSize * 2) * (this.miniBoss.health / this.miniBoss.maxHealth), 6);
        
        // Mini-boss symbol
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = `${pulseSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('👹', this.miniBoss.x, this.miniBoss.y);
    }
    
    drawHazards() {
        this.hazards.forEach(hazard => {
            if (!hazard.active) return;
            
            const pulseSize = hazard.size + Math.sin(hazard.pulse) * 5;
            const colors = {
                'energy_drain': '#FF4500',
                'slow_field': '#4169E1',
                'damage_zone': '#DC143C'
            };
            
            // Hazard glow
            this.ctx.shadowColor = colors[hazard.type];
            this.ctx.shadowBlur = 20;
            
            // Hazard body
            this.ctx.fillStyle = colors[hazard.type];
            this.ctx.beginPath();
            this.ctx.arc(hazard.x, hazard.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Hazard symbol
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = `${pulseSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            let symbol = '';
            switch(hazard.type) {
                case 'energy_drain': symbol = '⚡'; break;
                case 'slow_field': symbol = '🐌'; break;
                case 'damage_zone': symbol = '💀'; break;
            }
            
            this.ctx.fillText(symbol, hazard.x, hazard.y);
        });
    }
    
    drawPlayer() {
        // Player glow
        this.ctx.shadowColor = this.player.color;
        this.ctx.shadowBlur = 20;
        
        // Shield effect
        if (this.player.shield > 0) {
            this.ctx.strokeStyle = 'rgba(0, 191, 255, 0.8)';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(this.player.x, this.player.y, this.player.size + 10, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Player body
        this.ctx.fillStyle = this.player.color;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player inner circle
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.size * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player direction indicator
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.size * 0.8, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Invulnerability effect
        if (this.player.invulnerable > 0) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(this.player.x, this.player.y, this.player.size + 5, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        this.update();
        this.render();
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.gameLoop();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    reset() {
        this.score = 0;
        this.combo = 0;
        this.comboMultiplier = 1;
        this.lastCollectionTime = 0;
        
        this.player.x = 100;
        this.player.y = 100;
        this.player.trail = [];
        this.player.shield = 0;
        this.player.magnet = 0;
        this.player.speedBoost = 0;
        this.player.invulnerable = 0;
        
        this.particles = [];
        this.enemies = [];
        this.powerUps = [];
        this.miniBoss = null;
        this.hazards = [];
        
        this.generateEnergyItems();
        this.generateObstacles();
        this.generatePowerStations();
        this.generateEnemies();
        this.generatePowerUps();
        this.generateHazards();
        this.updateScore();
    }
    
    updateUltimateCharge() {
        // Ultimate charge slowly decreases over time
        if (this.player.ultimateCharge > 0) {
            this.player.ultimateCharge -= 0.1;
            if (this.player.ultimateCharge < 0) this.player.ultimateCharge = 0;
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start the top-down game after a short delay
    setTimeout(() => {
        window.topDownGame = new TopDownGame();
    }, 1000);
});