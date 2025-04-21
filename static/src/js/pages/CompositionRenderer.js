class CompositionRenderer {
  constructor(container) {
    this.container = container;

    // Create wrapper div
    this.wrapper = document.createElement("div");
    this.wrapper.style.display = "flex";
    this.wrapper.style.justifyContent = "space-around";
    this.wrapper.style.alignItems = "center";
    this.wrapper.style.flexWrap = "wrap"; // Mobile-friendly
    this.wrapper.style.gap = "20px";
    container.appendChild(this.wrapper);

    // Create canvas for particle animation
    this.canvas = document.createElement("canvas");
    this.canvas.style.flex = "1";
    this.canvas.style.minWidth = "300px";
    this.canvas.style.height = "300px";
    this.canvas.style.border = "1px solid #ccc";
    this.wrapper.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.scaleFactor = 1.0;
    this.expansionCenter = { x: 0, y: 0 };
    this.useLogScale = false; // << NEW

    // Create pie chart container
    this.pieDiv = document.createElement("div");
    this.pieDiv.id = "composition-piechart";
    this.pieDiv.style.flex = "1";
    this.pieDiv.style.minWidth = "300px";
    this.wrapper.appendChild(this.pieDiv);

    // Create slider and log scale checkbox
    this.sliderContainer = document.createElement("div");
    this.sliderContainer.style.width = "80%";
    this.sliderContainer.style.margin = "20px auto";
    this.sliderContainer.style.textAlign = "center";
    container.appendChild(this.sliderContainer);

    this.sliderLabel = document.createElement("div");
    this.sliderLabel.innerText = "Scale Factor (a)";
    this.sliderLabel.style.marginBottom = "5px";
    this.sliderContainer.appendChild(this.sliderLabel);

    const sliderBox = document.createElement("div");
    sliderBox.style.display = "flex";
    sliderBox.style.alignItems = "center";
    sliderBox.style.justifyContent = "center";
    sliderBox.style.gap = "15px";
    this.sliderContainer.appendChild(sliderBox);

    this.slider = document.createElement("input");
    this.slider.type = "range";
    this.slider.min = 0.01;
    this.slider.max = 5;
    this.slider.step = 0.01;
    this.slider.value = 1;
    this.slider.style.width = "400px";
    sliderBox.appendChild(this.slider);

    this.logCheckbox = document.createElement("input");
    this.logCheckbox.type = "checkbox";
    sliderBox.appendChild(this.logCheckbox);

    const logLabel = document.createElement("label");
    logLabel.innerText = "Log scale";
    sliderBox.appendChild(logLabel);

    this.slider.addEventListener("input", () => this.handleSliderInput());
    this.logCheckbox.addEventListener("change", () => this.handleSliderInput());

    this.resize();
    window.addEventListener("resize", () => this.resize());

    this.createParticles(200);
    this.createPieChart();
    this.animate();
  }

  resize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = 400;
    this.expansionCenter = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
  }

  createParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        type: this.randomType()
      });
    }
  }

  randomType() {
    const types = ["darkMatter", "normalMatter", "photons"];
    return types[Math.floor(Math.random() * types.length)];
  }

  getColor(type) {
    switch (type) {
      case "darkMatter": return "#5c6bc0";
      case "normalMatter": return "#ffb74d";
      case "photons": return "#4dd0e1";
      default: return "#ffffff";
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > this.canvas.width) p.dx = -p.dx;
      if (p.y < 0 || p.y > this.canvas.height) p.dy = -p.dy;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.getColor(p.type);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  handleSliderInput() {
    let a = parseFloat(this.slider.value);

    if (this.logCheckbox.checked) {
      const logMin = Math.log(0.01);
      const logMax = Math.log(5);
      const sliderFraction = (a - 0.01) / (5 - 0.01);
      a = Math.exp(logMin + sliderFraction * (logMax - logMin));
    }

    this.updateScale(a);
  }

  updateScale(a) {
    this.scaleFactor = a;

    const baseCount = 300;
    let adjustedCount = Math.floor(baseCount / Math.pow(a, 3));

    adjustedCount = Math.max(20, Math.min(adjustedCount, 500)); 

    this.createParticles(adjustedCount);
    this.updatePieChart(a);
  }

  createPieChart() {
    const data = this.calculateDensities(1.0);

    const pieData = [{
      values: [data.darkMatter, data.normalMatter, data.photons, data.darkEnergy],
      labels: ["Dark Matter", "Normal Matter", "Photons", "Dark Energy"],
      type: 'pie'
    }];

    const layout = {
      title: 'Composition of the Universe',
      height: 300,
      width: 400
    };

    Plotly.newPlot(this.pieDiv, pieData, layout);
  }

  updatePieChart(a) {
    const data = this.calculateDensities(a);

    Plotly.restyle(this.pieDiv, {
      values: [[data.darkMatter, data.normalMatter, data.photons, data.darkEnergy]]
    });
  }

  calculateDensities(a) {
    const initial = {
      darkEnergy: 0.68,
      darkMatter: 0.27,
      normalMatter: 0.05,
      photons: 0.0001
    };

    const darkMatterDensity = initial.darkMatter / Math.pow(a, 3);
    const normalMatterDensity = initial.normalMatter / Math.pow(a, 3);
    const photonDensity = initial.photons / Math.pow(a, 4);
    const darkEnergyDensity = initial.darkEnergy;

    const total = darkMatterDensity + normalMatterDensity + photonDensity + darkEnergyDensity;

    return {
      darkMatter: (darkMatterDensity / total) * 100,
      normalMatter: (normalMatterDensity / total) * 100,
      photons: (photonDensity / total) * 100,
      darkEnergy: (darkEnergyDensity / total) * 100
    };
  }
}

export { CompositionRenderer };
