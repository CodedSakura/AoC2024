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
		routes = [],
		[{ pos: start, score: 0, remaining: new Set(tiles), path: [ start ] }]
			.while(
				v => v.length > 0,
				v => v.sort((a, b) => a.score - b.score)
					.filter(({ score }) => routes.length > 0 ? routes.first.score >= score : true)
						.flatMap(({ pos, score, path, remaining }, i) => i !== 0 ? { pos, score, path, remaining } : pos.neighbors4()
							.filter(n => remaining.has(n.pos))
							.map(n => (
								newRem = new Set(remaining.collect()),
								newRem.delete(n.pos),
								{ 
									pos: n, 
									score: score + (n.rot === pos.rot ? 1 : 1001), 
									path: [ ...path, n ],
									remaining: newRem,
								}
							))
							.map(p => (p.pos.pos === end.pos ? (routes.push(p)) : null, p)))),
		data.best = routes
			.sort((a, b) => a.score - b.score)
			.run(r => r.filter(v => v.score === r.first.score))
			.flatMap(v => v.path.map(v => v.pos))
			.unique(),
		data
	))
	// <debug note="print route">
	// .run(d => (Array.fromSize2d(d.size, (x, y) => !d.tiles.has(new Pos(x, y)) ? '#' : 
	// 		(p = d.best.find(v => v.pos.pos === new Pos(x, y)), p ? 'O' : '.'))
	// 	.map(r => r.join("")).join("\n").print(), d))
	// </debug>
	.best.length
	.print();

// does not finish, JavaScript heap out of memory