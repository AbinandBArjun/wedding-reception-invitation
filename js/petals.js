/**
 * Falling Petals & Gold Dust Canvas Particle Engine
 * Creates dreamy, organic floating flower petals and delicate golden sparkle flakes
 */

class FallingPetalsEngine {
  constructor(canvasId = "petals-canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.petals = [];
    this.maxPetals = 28;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.animId = null;

    // Palette of soft floral petals and soft gold sparkles
    this.colors = [
      { r: 247, g: 223, b: 228, a: 0.75 }, // Blush rose
      { r: 255, g: 240, b: 243, a: 0.8 },  // Soft cream pink
      { r: 251, g: 244, b: 234, a: 0.7 },  // Ivory pearl
      { r: 228, g: 185, b: 195, a: 0.65 }, // Mauve rose
      { r: 216, g: 190, b: 132, a: 0.55 }  // Champagne gold flake
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Create initial petals dispersed vertically
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.createPetal(true));
    }

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createPetal(initial = false) {
    const isGoldFlake = Math.random() < 0.2;
    return {
      x: Math.random() * this.width,
      y: initial ? Math.random() * this.height : -30,
      size: isGoldFlake ? Math.random() * 3 + 2 : Math.random() * 12 + 8,
      speedY: Math.random() * 1.2 + 0.6,
      speedX: Math.random() * 0.8 - 0.4,
      swayFreq: Math.random() * 0.02 + 0.008,
      swayAmp: Math.random() * 25 + 15,
      swayOffset: Math.random() * Math.PI * 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.4,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.01,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      isGoldFlake
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];

      // Update position
      p.y += p.speedY;
      p.x += Math.sin(p.y * p.swayFreq + p.swayOffset) * 0.75 + p.speedX;
      p.rotation += p.rotSpeed;
      p.flip += p.flipSpeed;

      // Draw petal
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.scale(Math.sin(p.flip), 1);

      this.ctx.beginPath();
      if (p.isGoldFlake) {
        // Sparkling small diamond flake
        this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.color.a})`;
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Organic curved rose/magnolia petal shape
        this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.color.a})`;
        this.ctx.moveTo(0, -p.size);
        this.ctx.bezierCurveTo(
          p.size * 0.8, -p.size * 0.7,
          p.size * 0.9, p.size * 0.5,
          0, p.size
        );
        this.ctx.bezierCurveTo(
          -p.size * 0.9, p.size * 0.5,
          -p.size * 0.8, -p.size * 0.7,
          0, -p.size
        );
        this.ctx.fill();

        // Delicate inner vein shadow
        this.ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
        this.ctx.lineWidth = 0.8;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -p.size * 0.8);
        this.ctx.lineTo(0, p.size * 0.7);
        this.ctx.stroke();
      }

      this.ctx.restore();

      // Reset when off bottom or sides
      if (p.y > this.height + 40 || p.x < -40 || p.x > this.width + 40) {
        this.petals[i] = this.createPetal(false);
      }
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new FallingPetalsEngine("petals-canvas");
});
