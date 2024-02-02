export default {
  Basic: [
    {
      label: "Redshift (z)",
      def: "Redshift",
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
      type: "range",
      default: [0, 10],
      min: -0.998,
      max: 200,
      step: 0.1,
    },
    {
      label: "Log scale",
      type: "bool",
      default: false,
    },
  ],
  Distance: [
    {
      label: "Redshift domain",
      type: "range",
      default: [0.0001, 10],
      min: 0.0001,
      max: 200,
    },
    {
      label: "Log scale",
      type: "bool",
      default: false,
    },
  ],
  Density: [
    {
      label: "Plot as function of",
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
      type: "range",
      default: [0, 10],
      min: -0.998,
      max: 200,
    },
    {
      label: "Compare densities",
      type: "bool",
      default: true,
    },
    {
      label: "Log scale",
      type: "bool",
      default: false,
    },
  ],
  "Power Spectrum": [
    {
      label: "Power spectrum model",
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
      type: "range",
      default: [0.001, 100],
      min: 0.001,
      max: "Infinity",
      step: [0.1, 10],
    },
    {
      label: "Log scale",
      type: "bool",
      default: true,
    },
  ],
  Correlation: [
    {
      label: "Power spectrum model",
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
      type: "range",
      default: [0.1, 50],
      min: 1.0e-3,
      max: 50,
      step: [0.01, 1],
    },
    {
      label: "Log scale",
      type: "bool",
      default: true,
    },
  ],
  "Peak Height": [
    {
      label: "Power spectrum model",
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
      type: "range",
      default: [7, 16],
      min: 0,
      max: "Infinity",
      step: 1,
    },
    {
      label: "Redshift (z)",
      type: "float",
      default: 0,
      min: -0.998,
      max: 200,
    },
  ],
};
