const Tabs = {
	'Basic': {
		input: {
			'Redshift (z)': [ 'float', 0 ],
		},
		output: {

		}
	},
	'Time': {
		input: {
			'Function': [ 'radio', [ 'redshift (z)', 'time (t)', 'scale factor (a)' ]],
		},
		output: {

		}
	},
	'Distance': {
		input: {

		},
		output: {

		}
	},
	'Content': {
		input: {
			'Function': [ 'radio', [ 'redshift (z)', 'time (t)', 'scale factor (a)' ]],
			'Plot layout': [ 'radio', [ 'combined', 'seperate' ]]
		},
		output: {

		}
	},
	'Power Spectrum': {
		input: {
			'Model': [ 'radio', [ 'eisentein_98', 'eisenstein98_zb', 'sugiyama95', 'camb' ]],
			'Wavenumber (k)': [ 'range', [ 0.25, 0, 0.75, 1 ]] // [minDefault, min, maxDefault, max]
		},
		output: {

		}
	},
	'Correlation': {
		input: {
			'Model': [ 'radio', [ 'eisentein_98', 'eisenstein98_zb', 'sugiyama95', 'camb' ]],
			'Radius (R)': [ 'range', [ 0.25, 0, 0.75, 1 ]]
		},
		output: {

		}
	},
	'Peak Height': {
		input: {
			'Model': [ 'radio', [ 'eisentein_98', 'eisenstein98_zb', 'sugiyama95', 'camb' ]],
			'Halo mass (M)': [ 'range', [ 0.25, 0, 0.75, 1 ]],
		},
		output: {

		}
	},
};

export { Tabs };
