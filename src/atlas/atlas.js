atlasMain();

async function atlasMain() {
	const leftestNav = document.querySelector('.atlas-leftestnav'),
	      leftNav = document.querySelector('.atlas-leftnav'),
	      resultsPane = document.querySelector('.atlas-remains');


	[...leftestNav.children].forEach(child => {
	  leftestNav.removeChild(child);
	})

	

	const doAnimation = { 
		value: false,
		set(e) {
			this.value = e;
			this.doSetEffect(e);
		},
		doSetEffect() {			
			resultsPane
				?.classList[
					this.value ? 'add' : 'remove'
				]('fadeInUp');
		}
	}


	const cmd = { 
		value: new URLSearchParams(window.location.search).get('cmd'),
		set(e) {
			this.value = e;
			this.doSetEffect(e);
		},
		doSetEffect() {
			if (commandsByCategory[(cmd ?? '').toUpperCase()]) {
				document.getElementById('atlas-' + (cmd ?? '').toLowerCase())?.scrollIntoView({
					behavior: 'smooth'
				});
			}
		}
	}

	const currCmd = { 
		value: null,
		set(e) {
			this.value = e;
			this.doSetEffect(e);
		},
		doSetEffect() {
			setTimeout(() => {
				doAnimation.set(false);
			}, 250)
		}
	}

	const cData = { 
		value: null,
		set(e) {
			this.value = e;
			this.doSetEffect(e);
		},
		doSetEffect() {
			console.log("command data set")
		}
	}

	const procError = {
		value: null,
		set(e) {
			this.value = e;
			this.doSetEffect(e);
		},
		doSetEffect() {
			console.log("procerror set");
		}
	}
	const loading = {
		value: false,
		set(e) {
			this.value = e;
			this.doSetEffect(e);
		},
		doSetEffect() {
			console.log("loading set");
		}
	}

	const doCommand = (force) => {
		let cI = force ?? commandInput;
		loading.set(true);
		fetch('http://i.mizabot.xyz/command/' + encodeURIComponent(cI), {
			credentials: 'omit',
			mode: window.location.hostname.includes('mizabot.xyz') ? 'same-origin' : 'cors'
		}).then(async (e) => {
			let jsesc = await e.text();
			jsesc = jsesc
				.replace(/\n/g, "\\\\n")
				.replace(/\r/g, "\\\\r")
				.replace(/\t/g, "\\\\t");
			return JSON.parse(jsesc)
		}).then((e) => {
			cData.set(e[0]);
			procError.set(null);
			loading.set(false);
		}).catch(e => {
			loading.set(false);
			procError.set(e.toString());
		})
	}


	const catimages = new Map([
	  ['MAIN', 'https://discord.com/assets/516bf0fae97628e22a3a3ec810a8c4ba.svg'],
	  ['STRING', 'https://discord.com/assets/8db9972dd015f679c16544ac3e29e6b1.svg'],
	  ['ADMIN', 'https://discord.com/assets/0d9e341a5ff1e9d55e691cc7d86f05bd.svg'],
	  ['VOICE', 'https://discord.com/assets/0e7fc4b6265bd336e8fe4dca75417ee7.svg'],
	  ['IMAGE', 'https://discord.com/assets/59bdcc534c0d1adc1fb7575a1a4785a6.svg'],
	  ['FUN', 'https://discord.com/assets/559c3311dcdb3f23b7fb745559207db9.svg'],
	  ['OWNER', 'https://discord.com/assets/19fc9fc6001951c7370b1fd74e1570f1.svg'],
	  ['NSFW', 'https://discord.com/assets/ece853d6c1c1cd81f762db6c26fade40.svg'],
	  ['MISC', 'https://discord.com/assets/2e3fbb2338145553a3d26c677b4f83a3.svg']
	])

	let commandsByCategoryReq = await fetch('http://i.mizabot.xyz/static/HELP.json');
	let commandsByCategory = await commandsByCategoryReq.json();

}