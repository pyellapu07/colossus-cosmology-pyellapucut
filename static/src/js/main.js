import { Data } from './components/Data.js';

import { Header } from './pages/Header.js';
import { Sidebar } from './pages/Sidebar.js';
import { Resizer } from './pages/Resizer.js';
import { Output } from './pages/Output.js';

const main = {
	data: new Data(),
};

const dom = document.body;

const header = main.header = new Header( main );
dom.appendChild( header.dom );

const sidebar = main.sidebar = new Sidebar( main );
dom.appendChild( sidebar.dom );

const resizer = main.resizer = new Resizer( main );
dom.appendChild( resizer.dom );

const output = main.output = new Output( main );
dom.appendChild( output.dom );
