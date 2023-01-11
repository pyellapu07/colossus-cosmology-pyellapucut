import { Header } from './pages/Header.js';
import { Sidebar } from './pages/Sidebar.js';
import { Resizer } from './pages/Resizer.js';
import { Output } from './pages/Output.js';

const dom = document.body;

const header = new Header();
dom.appendChild( header.dom );

const sidebar = new Sidebar();
dom.appendChild( sidebar.dom );

const resizer = new Resizer();
dom.appendChild( resizer.dom );

const output = new Output( sidebar );
dom.appendChild( output.dom );
