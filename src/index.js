page.start()
page.strict(false);
window.__PAGES = window.__PAGES ?? {};
window.__PAGELEMS = window.__PAGELEMS ?? {};

let pageCount = 0;

page('*', (ctx) => {
	if (window.__PAGES[ctx.pathname]) {
		navigate(ctx.pathname, window.__PAGES[ctx.pathname]);
		return;
	}
	getPath(ctx.pathname === '/' ? '/home/' : ctx.pathname).then(routeHtml => {
		if (!routeHtml) {
			return;
		}
		window.__PAGES[ctx.pathname] = routeHtml;
		// C A C H E
		navigate(ctx.pathname, routeHtml);
	});
})
async function getPath(path) {
	let path2 = '/fragments/' + path.split('/').filter(e => e.length > 0).slice(-1) + '.fragment.html';
	try {
		let req = await fetch(path2);
		let reqText = await req.text();
		if (!reqText.startsWith('[[DOC-FRAGMENT]]\n', '')) {
			return false;
		}
		reqText = reqText.replace('[[DOC-FRAGMENT]]\n', '')
		return reqText;
	} catch(e) {
		return false;
	}
}


function nodeScriptReplace(node) {
	if ( nodeScriptIs(node) === true ) {
			node.parentNode.replaceChild( nodeScriptClone(node) , node );
	}
	else {
			var i = -1, children = node.childNodes;
			while ( ++i < children.length ) {
				  nodeScriptReplace( children[i] );
			}
	}

	return node;
}
function nodeScriptClone(node){
	var script  = document.createElement("script");
	script.text = node.innerHTML;

	var i = -1, attrs = node.attributes, attr;
	while ( ++i < attrs.length ) {									
		  script.setAttribute( (attr = attrs[i]).name, attr.value );
	}
	return script;
}

function nodeScriptIs(node) {
	return node.tagName === 'SCRIPT';
}

// ��

// Have fun

let prevPanel = document.getElementById('navigator')?.children?.[0];
if (prevPanel) {
	window.__PAGELEMS[location.pathname] = prevPanel;
}
function navigate(loc, toNode) {
	let nav = document.getElementById('navigator');
	if (!nav) { return false; }
	let doc;
	let it;
	if (window.__PAGELEMS[loc]) {
		doc = window.__PAGELEMS[loc];
		it = doc;
	} else {
		let parser = new DOMParser();
		doc = parser.parseFromString(toNode, 'text/html');
		it = doc.body.children[0];
	}

	if (prevPanel) {
		prevPanel.classList.remove('nav-in');
		prevPanel.classList.add('nav-out')
	}

	nav.appendChild(it);
	nodeScriptReplace(it);
	
	it.classList.remove('nav-out');
	it.classList.add('nav-in');

	document.body.classList.forEach((cl) => {
		if (cl.startsWith('page-')) {
			document.body.classList.remove(cl);
		}
	})
	document.body.classList.add('page' + 
		(
			loc === '/' ? '/landing' : loc
		).replaceAll('/', '-').split('-').slice(0, 2).join('-')
	)

	window.__PAGELEMS[loc] = it;
	window.it = it;
	prevPanel = it;

	return true;
}
// init load
document.getElementById('navigator')?.children[0]?.classList.add('nav-in');