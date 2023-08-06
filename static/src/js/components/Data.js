class Data {
  constructor(main) {
    this.main = main;
    this.models = [];
    this.tab = undefined;
    this.disabled = [];
  }

  needsUpdate() {
    if (this.main.output != undefined) this.main.output.runModel();
  }

  toJSON() {
    const models = this.models.filter((x) => !this.disabled.includes(x));

    return {
      models: models,
      tab: this.tab,
    };
  }
}

export { Data };
