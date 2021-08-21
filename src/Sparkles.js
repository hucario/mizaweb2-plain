function __Sparkles__Loop() {
    let sparkleybois = Array.from(document.querySelectorAll('.Sparkles'));
    sparkleybois.forEach(sp => {
        if (sp.children && (sp.children.length >= Math.max(4, parseInt(getComputedStyle(sp).width)/50))) {
            [...sp.children].forEach(e => {
				e.__SPEED = (e.__SPEED ?? Math.floor(Math.random() * 10)/10 + 0.5);
				e.__YEAOPAC = e.__YEAOPAC ?? false;
				e.__GOALOPAC = e.__GOALOPAC ?? Math.floor(Math.random() * 100)/100;
				e.__OPAC = (e.__OPAC ?? 0) + 0.01 * (
					e.__YEAOPAC ? -e.__SPEED : e.__SPEED
				);

				if (e.__OPAC > e.__GOALOPAC) {
					e.__YEAOPAC = true;
				}

                e.__SPARKLEY = (e.__SPARKLEY ?? (Math.random() * parseInt(getComputedStyle(sp).height))) + 0.5 * e.__SPEED
                e.__SPARKLEX = (
					e.__SPARKLEX ?? 
					Math.floor(
						Math.random() * (
								parseInt(getComputedStyle(sp).width) +
								parseInt(getComputedStyle(e).width)
						) - parseInt(getComputedStyle(e).width)
					)
				);
                e.__SIZE = (e.__SIZE ?? Math.floor(Math.random() * 8)/10) - 0.001*e.__SPEED;

				e.style.opacity = e.__OPAC;
                e.style.transform = `translate(${e.__SPARKLEX}px, ${e.__SPARKLEY}px) scale(${e.__SIZE})`;
                if (e.__OPAC < 0 || e.__SIZE < 0 || e.__SPARKLEY > (parseInt(getComputedStyle(sp).height) + parseInt(getComputedStyle(e).height))) {
                    delete e.__SIZE;
                    delete e.__SPARKLEY;
                    delete e.__SPARKLEX;
					delete e.__SPEED;
					delete e.__YEAOPAC;
					delete e.__GOALOPAC;
					delete e.__OPAC;
                }
            });
        } else {
            for (let i = sp.children.length; i <= Math.max(4, parseInt(getComputedStyle(sp).width)/50); i++) {
                let p = document.createElement('img');
                p.classList.add('Sparkles--sparkle');
                p.alt = " ";
                p.src = "https://discord.com/assets/e820a306c732b90515989dada9995a97.svg"
                sp.appendChild(p);
            }
        }
    });
    requestAnimationFrame(__Sparkles__Loop);
}

__Sparkles__Loop();