const utils = require("../utils");
const { Pos, Dir } = utils;

utils.read("input.txt")
	.chars2d()
	.run(map => ({
		size: map.size2d(),
		start: new Pos(map.findIndex2d(v => v === 'S'), Dir.E),
		end: new Pos(map.findIndex2d(v => v === 'E')),
		tiles: new Set(map.map((r, y) => r.map((v, x) => v !== '#' ? new Pos(x, y) : null))
			.flat()
			.filter(v => v)),
	}))
	.run(data => (
		({ start, end, tiles } = data),
		tiles.delete(start),
		remaining = new Set(tiles),
		paths = [{ pos: start, score: 0, path: [ start ] }]
			.while(
				v => v.every(({ pos }) => pos.pos !== end.pos),
				v => v.sort((a, b) => a.score - b.score)
					.flatMap(({ pos, score, path }, i) => i !== 0 ? { pos, score, path } : pos.neighbors4()
						.filter(n => remaining.has(n.pos))
						.map(n => (remaining.delete(n.pos), { pos: n, score: score + 1 + (n.rot === pos.rot ? 0 : 1000), path: [ ...path, n ] }))
					)
			),
		data.route = paths.find(p =>  p.pos.pos === end),
		data
	))
	// <debug note="print route">
	// .run(d => (Array.fromSize2d(d.size, (x, y) => !d.tiles.has(new Pos(x, y)) ? '#' : 
	// 		(p = d.route.path.find(v => v.pos === new Pos(x, y)), p ? '*' : '.'))
	// 	.map(r => r.join("")).join("\n").print(), d))
	// </debug>
	.route.score
	.print();
