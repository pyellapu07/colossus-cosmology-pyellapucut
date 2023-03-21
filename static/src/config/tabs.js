export default {
	"Basic": [
		{
			"label": "Redshift (z)",
			"type": "float",
			"value": {
				"default": 0,
				"min": -0.995,
				"max": 200
			}
		}
	],
	"Time": [
		{
			"label": "Plot as function of",
			"type": "radio",
			"value": [ "Redshift (z)", "Time (t)", "Scale factor (a)" ]
		},
		{
			"label": "Domain",
			"type": "range",
			"value": {
				"default": [ 0, 10 ],
				"min": - 0.995,
				"max": 200
			}
		},
		{
			"label": "Log scale",
			"type": "bool",
			"value": false
		}
	],
	"Distance": [
		{
			"label": "Redshift domain",
			"type": "range",
			"value": {
				"default": [ 0, 10 ],
				"min": 0,
				"max": 200
			}
		},
		{
			"label": "Log scale",
			"type": "bool",
			"value": false
		}
	],
	"Content": [
		{
			"label": "Plot as function of",
			"type": "radio",
			"value": [ "Redshift (z)", "Time (t)", "Scale factor (a)" ]
		},
		{
			"label": "Domain",
			"type": "range",
			"value": {
				"default": [ 0, 10 ],
				"min": - 0.995,
				"max": 200
			}
		},
		{
			"label": "Compare densities",
			"type": "bool",
			"value": true
		},
		{
			"label": "Log scale",
			"type": "bool",
			"value": false
		}
	],
	"Power Spectrum": [
		{
			"label": "Power spectrum model",
			"type": "radio",
			"value": [ "eisenstein98", "eisenstein98_zb", "sugiyama95", "camb" ]
		},
		{
			"label": "Wavenumber (k)",
			"type": "range",
			"value": {
				"default": [ 0.001, 100 ],
				"min": 0.001,
				"max": "Infinity"
			}
		},
		{
			"label": "Log scale",
			"type": "bool",
			"value": true
		}
	],
	"Correlation": [
		{
			"label": "Correlation model",
			"type": "radio",
			"value": [ "eisenstein98", "eisenstein98_zb", "sugiyama95", "camb" ]
		},
		{
			"label": "Radius (R)",
			"type": "range",
			"value": {
				"default": [ 0.1, 100 ],
				"min": 1.00e-03,
				"max": 5.00e+02
			}
		},
		{
			"label": "Log scale",
			"type": "bool",
			"value": true
		}
	],
	"Peak Height": [
		{
			"label": "Peak height model",
			"type": "radio",
			"value": [ "eisenstein98", "eisenstein98_zb", "sugiyama95", "camb" ]
		},
		{
			"label": "Halo mass (M)",
			"type": "range",
			"value": {
				"default": [ 10000000, 1e+16 ],
				"min": 0,
				"max": "Infinity"
			}
		},
		{
			"label": "Redshift (z)",
			"type": "float",
			"value": {
				"default": 0,
				"min": -0.995,
				"max": 200
			}
		},
		{
			"label": "Combine plotting",
			"type": "bool",
			"value": true
		},
		{
			"label": "Log scale",
			"type": "bool",
			"value": false
		}
	]
};
