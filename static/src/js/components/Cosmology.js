const Cosmology = {
	// 'planck18-only'   : {'flat': true, 'H0': 67.36, 'Om0': 0.3153, 'Ob0': 0.0493, 'sigma8': 0.8111, 'ns': 0.9649},
	'planck18': { 'flat': true, 'H0': 67.66, 'Om0': 0.3111, 'Ob0': 0.0490, 'sigma8': 0.8102, 'ns': 0.9665 },
	// 'planck15-only'   : {'flat': true, 'H0': 67.81, 'Om0': 0.3080, 'Ob0': 0.0484, 'sigma8': 0.8149, 'ns': 0.9677},
	'planck15': { 'flat': true, 'H0': 67.74, 'Om0': 0.3089, 'Ob0': 0.0486, 'sigma8': 0.8159, 'ns': 0.9667 },
	// 'planck13-only'   : {'flat': true, 'H0': 67.11, 'Om0': 0.3175, 'Ob0': 0.0490, 'sigma8': 0.8344, 'ns': 0.9624},
	'planck13': { 'flat': true, 'H0': 67.77, 'Om0': 0.3071, 'Ob0': 0.0483, 'sigma8': 0.8288, 'ns': 0.9611 },
	// 'WMAP9-only'      : {'flat': true, 'H0': 69.70, 'Om0': 0.2814, 'Ob0': 0.0464, 'sigma8': 0.8200, 'ns': 0.9710},
	// 'WMAP9-ML'        : {'flat': true, 'H0': 69.70, 'Om0': 0.2821, 'Ob0': 0.0461, 'sigma8': 0.8170, 'ns': 0.9646},
	'WMAP9': { 'flat': true, 'H0': 69.32, 'Om0': 0.2865, 'Ob0': 0.0463, 'sigma8': 0.8200, 'ns': 0.9608 },
	// 'WMAP7-only'      : {'flat': true, 'H0': 70.30, 'Om0': 0.2711, 'Ob0': 0.0451, 'sigma8': 0.8090, 'ns': 0.9660},
	// 'WMAP7-ML'        : {'flat': true, 'H0': 70.40, 'Om0': 0.2715, 'Ob0': 0.0455, 'sigma8': 0.8100, 'ns': 0.9670},
	'WMAP7': { 'flat': true, 'H0': 70.20, 'Om0': 0.2743, 'Ob0': 0.0458, 'sigma8': 0.8160, 'ns': 0.9680 },
	// 'WMAP5-only'      : {'flat': true, 'H0': 72.40, 'Om0': 0.2495, 'Ob0': 0.0432, 'sigma8': 0.7870, 'ns': 0.9610},
	// 'WMAP5-ML'        : {'flat': true, 'H0': 70.20, 'Om0': 0.2769, 'Ob0': 0.0459, 'sigma8': 0.8170, 'ns': 0.9620},
	'WMAP5': { 'flat': true, 'H0': 70.50, 'Om0': 0.2732, 'Ob0': 0.0456, 'sigma8': 0.8120, 'ns': 0.9600 },
	// 'WMAP3-ML'        : {'flat': true, 'H0': 73.20, 'Om0': 0.2370, 'Ob0': 0.0414, 'sigma8': 0.7560, 'ns': 0.9540},
	'WMAP3': { 'flat': true, 'H0': 73.50, 'Om0': 0.2342, 'Ob0': 0.0413, 'sigma8': 0.7420, 'ns': 0.9510 },
	// 'WMAP1-ML'        : {'flat': true, 'H0': 68.00, 'Om0': 0.3136, 'Ob0': 0.0497, 'sigma8': 0.9000, 'ns': 0.9700},
	'WMAP1': { 'flat': true, 'H0': 72.00, 'Om0': 0.2700, 'Ob0': 0.0463, 'sigma8': 0.9000, 'ns': 0.9900 },
	'illustris': { 'flat': true, 'H0': 70.40, 'Om0': 0.2726, 'Ob0': 0.0456, 'sigma8': 0.8090, 'ns': 0.9630, 'relspecies': false },
	'bolshoi': { 'flat': true, 'H0': 70.00, 'Om0': 0.2700, 'Ob0': 0.0469, 'sigma8': 0.8200, 'ns': 0.9500, 'relspecies': false },
	'multidark-planck': { 'flat': true, 'H0': 67.77, 'Om0': 0.3071, 'Ob0': 0.0482, 'sigma8': 0.8288, 'ns': 0.9600, 'relspecies': false },
	'millennium': { 'flat': true, 'H0': 73.00, 'Om0': 0.2500, 'Ob0': 0.0450, 'sigma8': 0.9000, 'ns': 1.0000, 'relspecies': false },
	'EdS': { 'flat': true, 'H0': 70.00, 'Om0': 1.0000, 'Ob0': 0.0000, 'sigma8': 0.8200, 'ns': 1.0000, 'relspecies': false },
	'powerlaw': { 'flat': true, 'H0': 70.00, 'Om0': 1.0000, 'Ob0': 0.0000, 'sigma8': 0.8200, 'ns': 1.0000, 'relspecies': false },
};

const CosmologyFormat = {
	flat: {
		text: 'flat',
		def: `If flat, there is no curvature, Ω<sub>k</sub> = 0
        , and the dark energy content of the universe is computed as 
        Ω<sub>de</sub> = 1 − Ω<sub>m</sub> − Ω<sub>γ</sub> − Ω<sub>ν</sub> 
        where Ω<sub>m</sub> is the density of matter (dark matter and baryons) 
        in units of the critical density, Ω<sub>γ</sub> is the density of photons, 
        and Ω<sub>ν</sub> the density of neutrinos.`
	},
	Ode0: {
		text: 'Ω<sub>de</sub>',
		def: `Ω<sub>de</sub>, the dark energy density in units of the critical density at z = 0.`
	},
	H0: {
		text: 'H<sub>0</sub>',
		def: `The Hubble constant in km/s/Mpc.`
	},
	Om0: {
		text: 'Ω<sub>m</sub>',
		def: `Ω<sub>m</sub>, the matter density in units of the critical density at z = 0 
        (includes all non-relativistic matter, i.e., dark matter and baryons but not neutrinos).`
	},
	Ob0: {
		text: 'Ω<sub>b</sub>',
		def: `Ω<sub>b</sub>, the baryon density in units of the critical density at z = 0.`
	},
	sigma8: {
		text: 'σ<sub>8</sub>',
		def: `The normalization of the power spectrum, i.e. the variance when the field 
        is filtered with a top hat filter of radius 8 Mpc/h.`
	},
	ns: {
		text: 'n<sub>s</sub>',
		def: `The tilt of the primordial power spectrum.`
	},
	relspecies: {
		text: 'relspecies',
		def: `If relspecies == False, all relativistic contributions to the energy density of the universe (such as photons and neutrinos) are ignored.`
	}
};

export { Cosmology, CosmologyFormat };
