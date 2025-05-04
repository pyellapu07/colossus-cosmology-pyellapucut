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
    this.canvas.style.width = "400px";
    this.canvas.style.height = "400px";
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
      const type = this.randomType();

      this.particles.push({
        baseX: this.expansionCenter.x + distance * dx,
        baseY: this.expansionCenter.y + distance * dy,
        offsetX: 0,
        offsetY: 0,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        type
      });
    }
  }

  randomType() {
    const r = Math.random();
    if (r < 0.25) return "matter";
    if (r < 0.35) return "baryon";
    if (r < 0.55) return "darkEnergy";
    if (r < 0.65) return "relativistic";
    if (r < 0.75) return "neutrino";
    return "photon"; // photon count exaggerated
  }

  getColor(type) {
  if (type === "photon") {
    const minA = 0.1;
    const maxA = 1.5;

    let t = (this.scaleFactor - minA) / (maxA - minA);
    t = Math.max(0, Math.min(t, 1)); // Clamp t between 0 and 1

    // Cyan → Brown
    const r = Math.floor(0 + (140 - 0) * t);
    const g = Math.floor(255 + (84 - 255) * t);
    const b = Math.floor(255 + (75 - 255) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }
    if (type === "matter") return "#1f77b4";        // blue
    if (type === "baryon") return "#ff7f0e";        // orange
    if (type === "darkEnergy") return "#2ca02c";    // green
    if (type === "relativistic") return "#d62728";  // red
    if (type === "neutrino") return "#9467bd";      // purple
    return "#ccc";
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
    this.scaleText.innerText = `Current a: ${a.toFixed(2)} - Universe is ${a.toFixed(2)}x bigger than at a = 1`;
    this.updatePieChart(a);
  }

  createPieChart() {
    const data = this.calculateDensities(1.0);

    const pieData = [{
      values: [
        data.matter,
        data.baryon,
        data.darkEnergy,
        data.relativistic,
        data.neutrino,
        data.photon
      ],
      labels: [
        "Matter",
        "Baryon",
        "Dark Energy",
        "Relativistic",
        "Neutrino",
        "Photon (count exaggerated for visibility)"
      ],
      type: 'pie',
      marker: {
        colors: [
          "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"
        ]
      }
    }];

    Plotly.newPlot(this.pieDiv, pieData, {
      title: 'Composition of the Universe',
      height: 400,
      width: 700,
      margin: { t: 80, b: 60, l: 60, r: 100 },
      legend: {
        orientation: "v",
        x: 1.1,
        y: 0.5
      }
    });

    const gradientLabel = document.createElement("div");
    gradientLabel.innerText = "Photon color transition with redshift";
    gradientLabel.style.marginTop = "10px";
    gradientLabel.style.fontSize = "12px";
    gradientLabel.style.textAlign = "center";
    this.pieDiv.appendChild(gradientLabel);

    const gradientBar = document.createElement("div");
    gradientBar.style.width = "200px";
    gradientBar.style.height = "12px";
    gradientBar.style.margin = "4px auto 10px auto";
    gradientBar.style.background = "linear-gradient(to right, #00ffff, #8c564b)";
    gradientBar.style.border = "1px solid #999";
    gradientBar.style.borderRadius = "3px";
    this.pieDiv.appendChild(gradientBar);
  }

  updatePieChart(a) {
    const data = this.calculateDensities(a);
    Plotly.restyle(this.pieDiv, {
      values: [[
        data.matter,
        data.baryon,
        data.darkEnergy,
        data.relativistic,
        data.neutrino,
        data.photon
      ]]
    });
  }

  calculateDensities(a) {
    const initial = {
      matter: 0.27,
      baryon: 0.05,
      darkEnergy: 0.68,
      relativistic: 0.0001,
      neutrino: 0.0001,
      photon: 0.0002
    };

    const matter = initial.matter / Math.pow(a, 3);
    const baryon = initial.baryon / Math.pow(a, 3);
    const darkEnergy = initial.darkEnergy;
    const relativistic = initial.relativistic / Math.pow(a, 4);
    const neutrino = initial.neutrino / Math.pow(a, 4);
    const photon = initial.photon / Math.pow(a, 4);

    const total = matter + baryon + darkEnergy + relativistic + neutrino + photon;

    return {
      matter: (matter / total) * 100,
      baryon: (baryon / total) * 100,
      darkEnergy: (darkEnergy / total) * 100,
      relativistic: (relativistic / total) * 100,
      neutrino: (neutrino / total) * 100,
      photon: (photon / total) * 100
    };
  }
}

export { CompositionRenderer };
