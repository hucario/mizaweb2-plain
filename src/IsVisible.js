/** 
 * New elements:
 */

function recursiveCheck(childNode) {
	if (!childNode) {
		return;
	}
	if (childNode instanceof Element && childNode.classList.contains('IsVisible')) {
		isVisible(childNode);
	}
	if (childNode.children) {
		Array.from(childNode.children).forEach((child) => {
			recursiveCheck(child);
		})		
	}
}
const observer = new MutationObserver((mutationList) => {
	mutationList.forEach( (mutation) => {
		if (mutation.type === 'childList') {
			mutation.addedNodes.forEach(recursiveCheck)
		}
	});
})
observer.observe(document.body, {
	childList: true,
	subtree: true
})

/**
 * Old ones:
 */

Array.from(document.getElementsByClassName('IsVisible')).forEach(isVisible)

function isVisible(node) {
	if (node.__OBSERVER) {
		return;
	}
	node.__OBSERVER = new IntersectionObserver(
		([entry]) => {
			if (!entry) {
				return;
			}

			let newVis = !!(
				entry.intersectionRatio > 
					(
						isNaN(parseInt(node.getAttribute('data-min-shown'))) ? 
							0 :
							parseInt(node.getAttribute('data-min-shown'))/100
					)
			);

			let wasVis = node.__IS_VISIBLE;

			node.__IS_VISIBLE = newVis;

			if (node.getAttribute('data-sticky') && wasVis) {
				// if sticky, don't run things twice
				// is sticky and has run, so
				return;
			}
			if (wasVis === newVis) {
				// no need to trigger a new render
				return;
			}
			
			if (!(node.getAttribute('data-stickyevt') && wasVis)) {
				// Has not run events prior, if needed
				try {
					window.visEvts?.[newVis ? 
						node.getAttribute('data-evts-visible') : 
						node.getAttribute('data-evts-invisible')
					]?.(entry)
				} catch(e) {}
			}


			if (node.getAttribute('data-stickycn') && wasVis) {
				// Has changed class prior, if needed
				return;
			}

			if (node.getAttribute('data-cn-visible') ?? node.getAttribute('data-cn-invisible')) {
				node.classList.add(
					node.getAttribute('data-cn-' + (newVis ? 'visible' : 'invisible')) ??
					(newVis ? 'visible' : 'invisible')
				)
				node.classList.remove(
					node.getAttribute('data-cn-' + (wasVis ? 'visible' : 'invisible')) ??
					(wasVis ? 'visible' : 'invisible')
				)
			}
		},
		{
			threshold: [0, 0.25, (
				isNaN(Number(node.getAttribute('data-min-shown')) ? 
					100 :
					Number(node.getAttribute('data-min-shown')))
			)/100, 0.75, 1]
		}
	)
	node.__OBSERVER.observe(node);
}