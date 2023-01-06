import { Header } from './Header.js';
import { Sidebar } from './Sidebar.js';
import { Resizer } from './Resizer.js';
import { Output } from './Output.js';

const dom = document.body;

const header = new Header();
dom.appendChild( header.dom );

const sidebar = new Sidebar();
dom.appendChild( sidebar.dom );

const resizer = new Resizer();
dom.appendChild( resizer.dom );

const output = new Output( sidebar );
dom.appendChild( output.dom );