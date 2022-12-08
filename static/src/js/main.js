import { Sidebar } from './Sidebar.js';
import { Resizer } from './Resizer.js';
import { Output } from './Output.js';

const sidebar = new Sidebar();
document.body.appendChild( sidebar.dom );

const resizer = new Resizer();
document.body.appendChild( resizer.dom );

const output = new Output( sidebar );
document.body.appendChild( output.dom );