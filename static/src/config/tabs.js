export default {
  Basic: [
    {
      label: "Redshift (z)",
      def: "In Colossus, redshift can range from -0.998 (a = 500) to 200 (a = 0.005)",
      type: "float",
      default: 0,
      min: -0.998,
      max: 200,
      step: 1,
    },
  ],
  Time: [
    {
      label: "Plot as function of",
      def: "Plot as a function of redshift (which can range from -0.998 to 200), time, or scale factor",
      type: "radio",
      options: [
        {
          label: "Redshift (z)",
        },
        {
          label: "Time (t)",
        },
        { label: "Scale factor (a)" },
      ],
    },
    {
      label: "Domain",
      def: "Range of redshift, time, or scale factor plotted",
      type: "range",
      default: [0, 10],
      min: -0.998,
      max: 200,
      step: 0.1,
    },
    {
      label: "Log scale",
      def: "Log or linear plots",
      type: "bool",
      default: false,
    },
  ],
  Distance: [
    {
      label: "Redshift domain",
      def: "Distances can only be computed for positive redshifts up to 200 (a = 0.005)",
      type: "range",
      default: [0.0001, 10],
      min: 0.0001,
      max: 200,
    },
    {
      label: "Log scale",
      def: "Log or linear plots (except for distance modulus, which is intrinsically a logarithmic measure)",
      type: "bool",
      default: false,
    },
  ],
  Density: [
    {
      label: "Plot as function of",
      def: "Plot as a function of redshift (which can range from -0.998 to 200), time, or scale factor",
      type: "radio",
      options: [
        {
          label: "Redshift (z)",
        },
        {
          label: "Time (t)",
        },
        { label: "Scale factor (a)" },
      ],
    },
    {
      label: "Domain",
      def: "Range of redshift, time, or scale factor plotted",
      type: "range",
      default: [0, 10],
      min: -0.998,
      max: 200,
    },
    {
      label: "Compare densities",
      def: "If set, plot the densities of all species and the corresponding fractional densities (Ω<sub>X</sub>) in two panels for each cosmology. If not set, plot separate panels for the density and fractional density of each species, comparing cosmologies within each panel.",
      type: "bool",
      default: true,
    },
    {
      label: "Log scale",
      def: "Log or linear plots",
      type: "bool",
      default: true,
    },
  ],
  "Power Spectrum": [
    {
      label: "Power spectrum model",
      def: "Colossus can approximate the linear matter power spectrum using the formulae of Eisenstein & Hu 1998 (with or without the BAO wiggles) or Sugiyama 1995. The Boltzmann code CAMB is more accurate but, if a new cosmology is generated, might take a few seconds to run in the background.",
      type: "radio",
      options: [
        {
          label: "Eisenstein & Hu 1998",
        },
        {
          label: "Eisenstein & Hu 1998 (no BAO)",
        },
        {
          label: "Sugiyama 1995",
        },
        {
          label: "CAMB",
        },
      ],
    },
    {
      label: "Scale",
      def: "The plotted range of the wavenumber k (in 1/Mpc)",
      type: "range",
      default: [0.001, 100],
      min: 0.001,
      max: "Infinity",
      step: [0.1, 10],
    },
    {
      label: "Log scale",
      def: "Log or linear scale (log scale is strongly recommended for power spectrum plots)",
      type: "bool",
      default: true,
    },
  ],
  Correlation: [
    {
      label: "Power spectrum model",
      def: "Colossus can approximate the linear matter power spectrum using the formulae of Eisenstein & Hu 1998 (with or without the BAO wiggles) or Sugiyama 1995. The Boltzmann code CAMB is more accurate but, if a new cosmology is generated, might take a few seconds to run in the background.",
      type: "radio",
      options: [
        {
          label: "Eisenstein & Hu 1998",
        },
        {
          label: "Eisenstein & Hu 1998 (no BAO)",
        },
        {
          label: "Sugiyama 1995",
        },
        {
          label: "CAMB",
        },
      ],
    },
    {
      label: "Radius (R)",
      def: "Radius range in Mpc",
      type: "range",
      default: [1.0, 500],
      min: 5e-3,
      max: 600,
      step: [0.01, 1],
    },
    {
      label: "Log scale",
      def: "Log or linear scale (log scale is strongly recommended)",
      type: "bool",
      default: true,
    },
  ],
  "Peak Height": [
    {
      label: "Power spectrum model",
      def: "Colossus can approximate the linear matter power spectrum using the formulae of Eisenstein & Hu 1998 (with or without the BAO wiggles) or Sugiyama 1995. The Boltzmann code CAMB is more accurate but, if a new cosmology is generated, might take a few seconds to run in the background.",
      type: "radio",
      options: [
        {
          label: "Eisenstein & Hu 1998",
        },
        {
          label: "Eisenstein & Hu 1998 (no BAO)",
        },
        {
          label: "Sugiyama 1995",
        },
        {
          label: "CAMB",
        },
      ],
    },
    {
      label: "Halo mass (M) [10<sup>x</sup>]",
      def: "Range of halo mass in log<sup>10</sup>M<sub>⊙</sub>",
      type: "range",
      default: [7, 16],
      min: -20,
      max: 19,
      step: 1,
    },
    {
      label: "Redshift (z)",
      def: "In Colossus, redshift can range from -0.998 (a = 500) to 200 (a = 0.005)",
      type: "float",
      default: 0,
      min: -0.998,
      max: 200,
    },
  ],
Composition: [
    {
      label: "Scale Factor (a)",
      def: "Adjust the expansion scale factor of the universe. a=1 today, a<1 in the past.",
      type: "range",
      default: [0.01, 2],
      min: 0.01,
      max: 10,
      step: 0.01
    }
]

};
