export default {
  planck18: {
    flat: true,
    H0: 67.66,
    Om0: 0.3111,
    Ob0: 0.049,
    sigma8: 0.8102,
    ns: 0.9665,
    Ode0: 0,
    relspecies: true,
    power_law: false,
    longname: "Planck 2018",
    shortname: "Planck 2018",
    ref_paper: "Planck Collab. 2018",
    ref_loc: "Table 2, column 6",
    ref_link: "http://adsabs.harvard.edu/abs/2020A%26A...641A...6P",
    comment: "Best-fit with BAO",
  },
  planck15: {
    flat: true,
    H0: 67.74,
    Om0: 0.3089,
    Ob0: 0.0486,
    sigma8: 0.8159,
    ns: 0.9667,
    Ode0: 0,
    relspecies: true,
    power_law: false,
    longname: "Planck 2015",
    shortname: "Planck 2015",
    ref_paper: "Planck Collab. 2015 ",
    ref_loc: "Table 4, column 6",
    ref_link: "http://adsabs.harvard.edu/abs/2016A%26A...594A..13P",
    comment: "Best-fit with extended datasets",
  },
  planck13: {
    flat: true,
    H0: 67.77,
    Om0: 0.3071,
    Ob0: 0.0483,
    sigma8: 0.8288,
    ns: 0.9611,
    Ode0: 0,
    relspecies: true,
    power_law: false,
    longname: "Planck 2013",
    shortname: "Planck 2013",
    ref_paper: "Planck Collab. 2013",
    ref_loc: "Table 5",
    ref_link: "http://adsabs.harvard.edu/abs/2014A%26A...571A..16P",
    comment: "Best-fit with BAO and other probes",
  },
  WMAP9: {
    flat: true,
    H0: 69.32,
    Om0: 0.2865,
    Ob0: 0.0463,
    sigma8: 0.82,
    ns: 0.9608,
    Ode0: 0,
    relspecies: true,
    power_law: false,
    longname: "WMAP9",
    shortname: "WMAP9",
    ref_paper: "Hinshaw et al. 2013",
    ref_loc: "Table 4",
    ref_link: "http://adsabs.harvard.edu/abs/2013ApJS..208...19H",
    comment: "Best-fit with eCMB, BAO and H0",
  },
  WMAP7: {
    flat: true,
    H0: 70.2,
    Om0: 0.2743,
    Ob0: 0.0458,
    sigma8: 0.816,
    ns: 0.968,
    Ode0: 0,
    relspecies: true,
    power_law: false,
    longname: "WMAP7",
    shortname: "WMAP7",
    ref_paper: "Komatsu et al. 2011",
    ref_loc: "Table 1",
    ref_link: "http://adsabs.harvard.edu/abs/2011ApJS..192...18K",
    comment: "Best-fit with BAO and H0",
  },
  WMAP5: {
    flat: true,
    H0: 70.5,
    Om0: 0.2732,
    Ob0: 0.0456,
    sigma8: 0.812,
    ns: 0.96,
    Ode0: 0,
    relspecies: true,
    power_law: false,
    longname: "WMAP5",
    shortname: "WMAP5",
    ref_paper: "Komatsu et al. 2009",
    ref_loc: "Table 1",
    ref_link: "http://adsabs.harvard.edu/abs/2009ApJS..180..330K",
    comment: "Best-fit with BAO and SN",
  },
  WMAP3: {
    flat: true,
    H0: 73.5,
    Om0: 0.2342,
    Ob0: 0.0413,
    sigma8: 0.742,
    ns: 0.951,
    Ode0: 0,
    relspecies: true,
    power_law: false,
    longname: "WMAP3",
    shortname: "WMAP3",
    ref_paper: "Spergel et al. 2007",
    ref_loc: "Table 5",
    ref_link: "http://adsabs.harvard.edu/abs/2007ApJS..170..377S",
    comment: "Best fit, WMAP only",
  },
  WMAP1: {
    flat: true,
    H0: 72,
    Om0: 0.27,
    Ob0: 0.0463,
    sigma8: 0.9,
    ns: 0.99,
    Ode0: 0,
    relspecies: true,
    power_law: false,
    longname: "WMAP1",
    shortname: "WMAP1",
    ref_paper: "Spergel et al. 2003",
    ref_loc: "Table 7/4",
    ref_link: "http://adsabs.harvard.edu/abs/2003ApJS..148..175S",
    comment: "Best fit, WMAP only",
  },
  EdS: {
    flat: true,
    H0: 70,
    Om0: 1,
    Ob0: 0,
    sigma8: 0.82,
    ns: 1,
    Ode0: 0,
    relspecies: false,
    power_law: false,
    longname: "Einstein-de Sitter",
    shortname: "EdS",
    ref_paper: "",
    ref_loc: "",
    ref_link: "",
    comment: "Einstein-de Sitter cosmology",
  },
  powerlaw: {
    flat: true,
    H0: 70,
    Om0: 1,
    Ob0: 0,
    sigma8: 0.82,
    ns: 1,
    Ode0: 0,
    relspecies: false,
    power_law: true,
    power_law_n: -2,
    longname: "Self-similar",
    shortname: "Self-similar",
    ref_paper: "",
    ref_loc: "",
    ref_link: "",
    comment: "Einstein-de Sitter plus a self-similar, power-law power spectrum",
  },
  bolshoi: {
    flat: true,
    H0: 70,
    Om0: 0.27,
    Ob0: 0.0469,
    sigma8: 0.82,
    ns: 0.95,
    Ode0: 0,
    relspecies: false,
    power_law: false,
    longname: "Bolshoi Simulation",
    shortname: "Bolshoi",
    ref_paper: "Klypin et al. 2011",
    ref_loc: "",
    ref_link: "http://adsabs.harvard.edu/abs/2011ApJ...740..102K",
    comment: "Cosmology of the Bolshoi N-body simulation",
  },
  eagle: {
    flat: true,
    H0: 67.77,
    Om0: 0.307,
    Ob0: 0.04825,
    sigma8: 0.8288,
    ns: 0.9611,
    Ode0: 0,
    relspecies: false,
    power_law: false,
    longname: "EAGLE Simulation",
    shortname: "EAGLE",
    ref_paper: "Schaye et al. 2015",
    ref_loc: "",
    ref_link: "http://adsabs.harvard.edu/abs/2015MNRAS.446..521S",
    comment: "Cosmology of the EAGLE simulation",
  },
  "horizon-agn": {
    flat: true,
    H0: 70.4,
    Om0: 0.272,
    Ob0: 0.045,
    sigma8: 0.81,
    ns: 0.967,
    Ode0: 0,
    relspecies: false,
    power_law: false,
    longname: "Horizon-AGN Simulation",
    shortname: "Horizon-AGN",
    ref_paper: "Dubois et al. 2014",
    ref_loc: "",
    ref_link: "http://adsabs.harvard.edu/abs/2014MNRAS.444.1453D",
    comment: "Cosmology of the Horizon-AGN simulation",
  },
  illustris: {
    flat: true,
    H0: 70.4,
    Om0: 0.2726,
    Ob0: 0.0456,
    sigma8: 0.809,
    ns: 0.963,
    Ode0: 0,
    relspecies: false,
    power_law: false,
    longname: "Illustris Simulation",
    shortname: "Illustris",
    ref_paper: "Vogelsberger et al. 2014",
    ref_loc: "",
    ref_link: "http://adsabs.harvard.edu/abs/2014MNRAS.444.1518V",
    comment: "Cosmology of the original Illustris simulation",
  },
  "illustris-tng": {
    flat: true,
    H0: 67.74,
    Om0: 0.3089,
    Ob0: 0.0486,
    sigma8: 0.8159,
    ns: 0.9667,
    Ode0: 0,
    relspecies: true,
    power_law: false,
    longname: "IllustrisTNG Simulations",
    shortname: "IllustrisTNG",
    ref_paper: "Pillepich et al. 2018 ",
    ref_loc: "",
    ref_link: "http://adsabs.harvard.edu/abs/2018MNRAS.475..648P",
    comment: "Cosmology of the IllustrisTNG simulation suite",
  },
  millennium: {
    flat: true,
    H0: 73,
    Om0: 0.25,
    Ob0: 0.045,
    sigma8: 0.9,
    ns: 1,
    Ode0: 0,
    relspecies: false,
    power_law: false,
    longname: "Millennium Simulation",
    shortname: "Millennium",
    ref_paper: "Springel et al. 2005",
    ref_loc: "",
    ref_link: "http://adsabs.harvard.edu/abs/2005Natur.435..629S",
    comment: "Cosmology of the Millennium N-body simulation",
  },
  "multidark-planck": {
    flat: true,
    H0: 67.77,
    Om0: 0.3071,
    Ob0: 0.0482,
    sigma8: 0.8288,
    ns: 0.96,
    Ode0: 0,
    relspecies: false,
    power_law: false,
    longname: "MultiDark-Planck Sim.",
    shortname: "MD-Planck",
    ref_paper: "Klypin et al. 2016",
    ref_loc: "Table 1",
    ref_link: "http://adsabs.harvard.edu/abs/2016MNRAS.457.4340K",
    comment: "Cosmology of the Multidark-Planck N-body simulations",
  },
  simba: {
    flat: true,
    H0: 68,
    Om0: 0.3,
    Ob0: 0.048,
    sigma8: 0.82,
    ns: 0.97,
    Ode0: 0,
    relspecies: false,
    power_law: false,
    longname: "SIMBA Simulation",
    shortname: "SIMBA",
    ref_paper: "Dave et al. 2019",
    ref_loc: "",
    ref_link: "http://adsabs.harvard.edu/abs/2019MNRAS.486.2827D",
    comment: "Cosmology of the SIMBA simulation",
  },
};
