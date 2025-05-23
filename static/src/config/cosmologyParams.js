export default {
  flat: {
    label: "Flat",
    def: "If flat, there is no curvature, Ω<sub>k</sub> = 0, and the dark energy content of the universe is computed as Ω<sub>de</sub> = 1 − Ω<sub>m</sub> − Ω<sub>γ</sub> − Ω<sub>ν</sub> where Ω<sub>m</sub> is the density of matter (dark matter and baryons) in units of the critical density, Ω<sub>γ</sub> is the density of photons, and Ω<sub>ν</sub> the density of neutrinos.",
    type: "bool",
    dependencies: { Ode0: [false] },
  },
  H0: {
    label: "H<sub>0</sub>",
    def: "The Hubble constant in km/s/Mpc.",
    type: "float",
    min: 0,
    step: 1,
  },
  Om0: {
    label: "Ω<sub>m</sub>",
    def: "The matter density in units of the critical density at z = 0 (includes all non-relativistic matter, i.e., dark matter and baryons but not neutrinos).",
    type: "float",
    min: 0,
    max: 0.9999,
    step: 0.1,
  },
  Ob0: {
    label: "Ω<sub>b</sub>",
    def: "The baryon density in units of the critical density at z = 0.",
    type: "float",
    min: 0,
    max: 1,
    step: 0.01,
  },
  Ode0: {
    label: "Ω<sub>de</sub>",
    def: "The dark energy density in units of the critical density at z = 0.",
    type: "float",
    min: 0,
    max: 1,
    step: 0.1,
  },
  sigma8: {
    label: "σ<sub>8</sub>",
    def: "The normalization of the power spectrum, i.e. the variance when the field is filtered with a top hat filter of radius 8 Mpc/h.",
    type: "float",
    min: 0,
    step: 0.1,
    advanced: true,
  },
  ns: {
    label: "n<sub>s</sub>",
    def: "The tilt of the primordial power spectrum.",
    type: "float",
    min: 0,
    step: 0.1,
    advanced: true,
  },
  relspecies: {
    label: "Relativistic species",
    def: "If set, relativistic contributions to the energy density of the universe (such as photons and neutrinos) are calculated basd on T<sub>CMB</sub> and N<sub>eff</sub>. Otherwise, relativistic species are ignored.",
    type: "bool",
    advanced: true,
    dependencies: {
      Tcmb0: [true],
      Neff: [true],
    },
  },
  Tcmb0: {
    label: "T<sub>CMB</sub> (K)",
    def: "The temperature of the CMB at z = 0 in Kelvin.",
    type: "float",
    advanced: true,
    default: 2.7255,
    step: 0.1,
  },
  Neff: {
    label: "N<sub>eff</sub>",
    def: "The effective number of neutrino species.",
    type: "float",
    advanced: true,
    default: 3.046,
  },
  de_model: {
    label: "Dark energy model",
    def: "The DE equation of state can either be a cosmological constant (Λ), a constant w = w<sub>0</sub> (where Λ corresponds to w<sub>0</sub> = -1), or a linear function of redshift (where w = w<sub>0</sub> + w<sub>a</sub> z/[1 + z]).",
    type: "radio",
    advanced: true,
    options: [
      {
        label: "Cosmological constant (Λ)",
        value: "lambda",
      },
      {
        label: "Constant EOS (w<sub>0</sub>)",
        value: "w0",
      },
      {
        label: "Varying EOS (w<sub>0</sub>-w<sub>a</sub>)",
        value: "w0wa",
      },
    ],
    dependencies: { w0: ["w0", "w0wa"], wa: ["w0wa"] },
  },
  w0: {
    label: "w<sub>0</sub>",
    def: "See the description of the different dark energy models.",
    type: "float",
    advanced: true,
    default: -1.0,
  },
  wa: {
    label: "w<sub>a</sub>",
    def: "See the description of the different dark energy models.",
    type: "float",
    advanced: true,
    default: 0.0,
  },
  power_law: {
    label: "Self-similar power spectrum",
    def: "Create a self-similar cosmology with a power-law matter power spectrum. To create a fully self-similar cosmology, this option should be implemented in a flat Universe with Ω<sub>m</sub> = 1.",
    type: "bool",
    dependencies: { power_law_n: [true] },
    advanced: true,
    default: false,
    step: 0.1,
  },
  power_law_n: {
    label: "PS slope",
    def: "The slope of the power-law matter power spectrum. The slope must be greater than -3 because below that slope, there is increasingly more variance on large than on small scales, which is not physically possible.",
    type: "float",
    advanced: true,
    default: -2.0,
    min: -2.9999,
    max: -0.0001,
    step: 0.1,
  },
};
