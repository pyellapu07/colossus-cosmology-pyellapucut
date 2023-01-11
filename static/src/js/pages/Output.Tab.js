import { Tabs } from '../components/Tabs.js';
import { Input } from '../components/Input.js';

function OutputTab() {

	const tab = this.dom = document.createElement( 'div' );
	tab.id = 'tab';

	const header = document.createElement( 'div' );
	header.classList.add( 'header' );
	tab.appendChild( header );

	const content = document.createElement( 'div' );
	content.classList.add( 'content' );
	tab.appendChild( content );

	let activeTab;
	const tabList = [];

	for ( const name in Tabs ) {

		const tabContainer = {
			button: undefined,
			inputs: []
		};

		tabList.push( tabContainer );

		// header tabs
		const button = document.createElement( 'button' );
		button.innerText = name;
		header.appendChild( button );
		tabContainer.button = button;

		// content
		const inputs = Tabs[ name ].input;

		for ( const label in inputs ) {

			const elem = new Input( label, inputs[ label ][ 0 ], inputs[ label ][ 1 ], 'TEST' );
			content.appendChild( elem.dom );
			tabContainer.inputs.push( elem.dom );

		}

		function onTabSwitch() {

			delete activeTab.button.dataset.selected;

			for ( const input of activeTab.inputs ) {

				delete input.dataset.selected;

			}

			button.dataset.selected = '';
			activeTab = tabContainer;

			for ( const input of tabContainer.inputs ) {

				input.dataset.selected = '';

			}

		}

		// switching tabs
		button.addEventListener( 'click', onTabSwitch );

	}

	activeTab = tabList[ 0 ];
	activeTab.button.dataset.selected = '';
	for ( const input of activeTab.inputs ) {

		input.dataset.selected = '';

	}

}

export { OutputTab };
