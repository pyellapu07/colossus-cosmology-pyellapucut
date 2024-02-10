const infoContent = [
  ["Colossus", null],
  ["Docs", "https://bdiemer.bitbucket.io/colossus/"],
  ["Code", "https://bitbucket.org/bdiemer/colossus"],
  ["Paper", "https://ui.adsabs.harvard.edu/abs/2018ApJS..239...35D/abstract"],
  ["Cite", "https://ui.adsabs.harvard.edu/abs/2018ApJS..239...35D/exportcitation"],
  ["•", null],
  ["Report a bug", "https://forms.gle/kj8c2pjuTbVYQ4PB6"],
  ["•", null],
  ['Web calculator © 2023-2024 by <a href="https://www.echou.xyz" target="_blank">Erik Chou</a> & <a href="http://www.benediktdiemer.com/" target="_blank">Benedikt Diemer</a>', null],
  ["•", null],
  ["Funded by the", null],
  ["National Science Foundation", "https://www.nsf.gov/"],
];

class Footer {
  constructor() {
    const dom = (this.dom = document.createElement("div"));
    dom.id = "footer";

    for (const content of infoContent) {
      const isLink = content[1] != null;
      const elem = document.createElement(isLink ? "a" : "span");
      elem.innerHTML = content[0];
      elem.tabIndex = 0;

      if (isLink) {
        elem.href = content[1];
        elem.target = "_blank";
      }

      dom.appendChild(elem);
    }
  }
}

export { Footer };
