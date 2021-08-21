/*======================================*\
#                                        #
#   This server is COMPLETELY INSECURE   #
#   DON'T USE IT IN PROD                 #
#                                        #
\*======================================*/




import express, { static } from "express";
import { resolve } from "path";
import { existsSync, readFileSync } from 'fs';

const app = express();

static(resolve(__dirname, '/src'), '')

app.get("/fragments/*", (req, res) => {
	if (existsSync(resolve(__dirname, 'src', ...req.path.split('/')))) {
		// NOT SECURE, DO NOT USE IN PROD
		res.sendFile(resolve(__dirname, 'src', ...req.path.split('/')));
		return;
	}
	res.sendFile(resolve(__dirname, 'src', 'fragments', '404.fragment.html'))
});


/* Redirect all routes to our (soon to exist) "index.html" file */
app.get("*", (req, res) => {
	let p = [];
	if (req.path === '/') {
		p = ['/home'];
	} else {
		p = req.path.split('/').filter(e => e.length > 0 && !!e); // remove falsey
	}
	if (req.headers.accept?.includes('text/html')) {
		if (p.length > 1) {
			p = [...p.slice(-1), p[p.length-1].replace('/', '') + '.fragment.html']
		} else {
			if (p.length === 0) {
				p = ['home.fragment.html']
			} else {
				p = [p[0].replace('/', '') + '.fragment.html']
			}
		}
		let resp;
		if (existsSync(resolve(__dirname, 'src', 'fragments', ...p))) {
			resp = readFileSync(resolve(__dirname, 'src', 'fragments', ...p), 'utf-8');
		} else {
			resp = readFileSync(resolve(__dirname, 'src', 'fragments', '404.fragment.html'), 'utf-8');
		}

		res.send(readFileSync(resolve(__dirname, 'src', 'index.html'), 'utf-8').replace('[[ REPLACE ME ]]', resp.replace('[[DOC-FRAGMENT]]', '')));
		return;
	}
	
	if (existsSync(resolve(__dirname, 'src', ...p))) {
		res.sendFile(resolve(__dirname, 'src', ...p));
		return;
	} else {
		let resp = readFileSync(resolve(__dirname, 'src', 'fragments', 'home.fragment.html'), 'utf-8');
		res.send(readFileSync(resolve(__dirname, 'src', 'index.html'), 'utf-8').replace('[[ REPLACE ME ]]', resp));
	}
});

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));