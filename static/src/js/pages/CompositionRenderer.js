class CompositionRenderer {
  constructor(container) {
    this.container = container;

    // UI Setup
    this.wrapper = document.createElement("div");
    this.wrapper.style.display = "flex";
    this.wrapper.style.justifyContent = "space-around";
    this.wrapper.style.alignItems = "center";
    this.wrapper.style.flexWrap = "wrap";
    this.wrapper.style.gap = "20px";
    container.appendChild(this.wrapper);

    this.canvas = document.createElement("canvas");
    this.canvas.style.flex = "1";
    this.canvas.style.width = "400px";   // fixed width
    this.canvas.style.height = "400px";  // match height
    this.canvas.style.border = "1px solid #ccc";
    this.wrapper.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.scaleFactor = 1.0;
    this.expansionCenter = { x: 0, y: 0 };

    this.pieDiv = document.createElement("div");
    this.pieDiv.id = "composition-piechart";
    this.pieDiv.style.flex = "1";
    this.pieDiv.style.width = "500px";
    this.wrapper.appendChild(this.pieDiv);

    // Slider UI
    this.sliderContainer = document.createElement("div");
    this.sliderContainer.style.width = "80%";
    this.sliderContainer.style.margin = "20px auto";
    this.sliderContainer.style.textAlign = "center";
    container.appendChild(this.sliderContainer);

    this.sliderLabel = document.createElement("div");
    this.sliderLabel.innerText = "Scale Factor (a)";
    this.sliderLabel.style.marginBottom = "5px";
    this.sliderContainer.appendChild(this.sliderLabel);

    this.scaleText = document.createElement("div");
    this.scaleText.style.marginTop = "10px";
    this.scaleText.style.fontSize = "14px";
    this.sliderContainer.appendChild(this.scaleText);

    const sliderBox = document.createElement("div");
    sliderBox.style.display = "flex";
    sliderBox.style.alignItems = "center";
    sliderBox.style.justifyContent = "center";
    sliderBox.style.gap = "15px";
    this.sliderContainer.appendChild(sliderBox);

    this.slider = document.createElement("input");
    this.slider.type = "range";
    this.slider.min = 0.1;
    this.slider.max = 3;
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

    this.resetButton = document.createElement("button");
    this.resetButton.innerText = "Reset to Default (a = 1)";
    this.resetButton.style.marginTop = "10px";
    this.resetButton.style.padding = "6px 12px";
    this.resetButton.style.cursor = "pointer";
    this.sliderContainer.appendChild(this.resetButton);

    this.resetButton.addEventListener("click", () => {
      this.slider.value = 1;
      this.logCheckbox.checked = false;
      this.handleSliderInput();
    });

    this.slider.addEventListener("input", () => this.handleSliderInput());
    this.logCheckbox.addEventListener("change", () => this.handleSliderInput());

    // Init
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.createParticles(400);
    this.createPieChart();
    this.handleSliderInput();
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
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 100 + 40;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);

      this.particles.push({
        baseX: this.expansionCenter.x + distance * dx,
        baseY: this.expansionCenter.y + distance * dy,
        offsetX: 0,
        offsetY: 0,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        type: this.randomType()
      });
    }
  }

  randomType() {
    const r = Math.random();
    if (r < 0.25) return "darkMatter";
    if (r < 0.30) return "normalMatter";
    if (r < 0.40) return "photons";
    return "darkEnergy";
  }

  getColor(type) {
    if (type === "photons") {
      const z = (1 / this.scaleFactor) - 1;
      const t = Math.max(0, Math.min(z / 10, 1));
      const g = 255;
      const b = Math.floor(255 * (1 - t));
      return `rgb(0, ${g}, ${b})`;
    }
    if (type === "darkMatter") return "#5c6bc0";
    if (type === "normalMatter") return "#ffb74d";
    if (type === "darkEnergy") return "#ef5350";
    return "#ffffff";
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      p.offsetX += p.dx * 0.1;
      p.offsetY += p.dy * 0.1;

      const zoom = Math.max(this.scaleFactor, 0.2);
      const x = (p.baseX + p.offsetX - this.expansionCenter.x) * zoom + this.expansionCenter.x;
      const y = (p.baseY + p.offsetY - this.expansionCenter.y) * zoom + this.expansionCenter.y;

      this.ctx.beginPath();
      this.ctx.arc(x, y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.getColor(p.type);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  handleSliderInput() {
    let a = parseFloat(this.slider.value);
    if (this.logCheckbox.checked) {
      const logMin = Math.log(0.1);
      const logMax = Math.log(3);
      const sliderFraction = (a - 0.1) / (3 - 0.1);
      a = Math.exp(logMin + sliderFraction * (logMax - logMin));
    }

    this.scaleFactor = a;
    this.scaleText.innerText = `Current a: ${a.toFixed(2)} - Universe is ${a.toFixed(2)}x bigger than at a = 1`; // ✅ fixed backticks
    this.updatePieChart(a);
  }

  createPieChart() {
    const data = this.calculateDensities(1.0);

    const pieData = [{
      values: [data.darkMatter, data.normalMatter, data.photons, data.darkEnergy],
      labels: [
        "Dark Matter",
        "Normal Matter",
        "Photons (exaggerated count for visibility)",
        "Dark Energy"
      ],
      type: 'pie',
      marker: {
        colors: ["#5c6bc0", "#ffb74d", "#4dd0e1", "#ef5350"]
      }
    }];

    Plotly.newPlot(this.pieDiv, pieData, {
      title: 'Composition of the Universe',
      height: 300,
      width: 700,
      margin: { t: 40, b: 20, l: 20, r: 150 },
      legend: {
        orientation: "v",
        x: 1.1,
        y: 0.5
      }
    });

    const gradientLabel = document.createElement("div");
    gradientLabel.innerText = "Photon color transition with redshift";
    gradientLabel.style.marginTop = "8px";
    gradientLabel.style.fontSize = "12px";
    gradientLabel.style.textAlign = "center";
    this.pieDiv.appendChild(gradientLabel);

    const gradientBar = document.createElement("div");
    gradientBar.style.width = "150px";
    gradientBar.style.height = "10px";
    gradientBar.style.margin = "4px auto";
    gradientBar.style.background = "linear-gradient(to right, rgb(0,255,0), rgb(0,255,255))";
    gradientBar.style.border = "1px solid #aaa";
    this.pieDiv.appendChild(gradientBar);
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
