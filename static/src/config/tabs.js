export default {
  Basic: [
    {
      label: "Redshift (z)",
      type: "float",
      value: {
        default: 0,
        min: -0.995,
        max: 200,
      },
    },
  ],
  Time: [
    {
      label: "Plot as function of",
      type: "radio",
      value: [
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
      value: {
        default: [0, 10],
        min: -0.995,
        max: 200,
      },
    },
    {
      label: "Log scale",
      type: "bool",
      value: { default: false },
    },
  ],
  Distance: [
    {
      label: "Redshift domain",
      type: "range",
      value: {
        default: [0, 10],
        min: 0,
        max: 200,
      },
    },
    {
      label: "Log scale",
      type: "bool",
      value: { default: false },
    },
  ],
  Density: [
    {
      label: "Plot as function of",
      type: "radio",
      value: [
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
      value: {
        default: [0, 10],
        min: -0.995,
        max: 200,
      },
    },
    {
      label: "Compare densities",
      type: "bool",
      value: {
        default: true,
      },
    },
    {
      label: "Log scale",
      type: "bool",
      value: { default: false },
    },
  ],
  "Power Spectrum": [
    {
      label: "Power spectrum model",
      type: "radio",
      value: [
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
      label: "Wavenumber (k)",
      type: "range",
      value: {
        default: [0.001, 100],
        min: 0.001,
        max: "Infinity",
      },
    },
    {
      label: "Log scale",
      type: "bool",
      value: { default: true },
    },
  ],
  Correlation: [
    {
      label: "Correlation model",
      type: "radio",
      value: [
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
      value: {
        default: [0.1, 100],
        min: 1.0e-3,
        max: 5.0e2,
      },
    },
    {
      label: "Log scale",
      type: "bool",
      value: { default: true },
    },
  ],
  "Peak Height": [
    {
      label: "Peak height model",
      type: "radio",
      value: [
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
      label: "Halo mass (M)",
      type: "range",
      value: {
        default: [10000000, 1e16],
        min: 0,
        max: "Infinity",
      },
    },
    {
      label: "Redshift (z)",
      type: "float",
      value: {
        default: 0,
        min: -0.995,
        max: 200,
      },
    },
    {
      label: "Combine plotting",
      type: "bool",
      value: { default: true },
    },
    {
      label: "Log scale",
      type: "bool",
      value: { default: false },
    },
  ],
};
