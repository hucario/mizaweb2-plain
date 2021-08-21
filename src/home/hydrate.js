window.visEvts = {
	...(window.visEvts ?? {}),
	"home-start": (entry) => {
		Array.from(document.querySelectorAll('.home-bars')).forEach((e) => {
			e.style.setProperty('--width', 1.05)
		})
	},
	"home-end": () => {
		Array.from(document.querySelectorAll('.home-bars')).forEach((e) => {
			e.style.setProperty('--width', 0)
		})
	}
}

tsParticles.loadJSON("sparkles", "/home/particlesconfig.json")
tsParticles.loadJSON("cogs1", "/home/cogsconfig1.json")
tsParticles.loadJSON("cogs2", "/home/cogsconfig2.json")
tsParticles.loadJSON("leaves", "/home/leavesconfig.json")