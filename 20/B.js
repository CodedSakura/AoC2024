const utils = require("../utils");
const { Pos } = utils; 

utils.read("input.txt")
	.chars2d()
	.run(map => ({
		size: map.size2d(),
		start: new Pos(map.findIndex2d(v => v === 'S')),
		end: new Pos(map.findIndex2d(v => v === 'E')),
		tiles: new Set(map.map((r, y) => r.map((v, x) => v !== '#' ? new Pos(x, y) : null))
			.flat().filter(v => v)),
	}))
	.run(data => (
		({ start, end, tiles } = data),
		tiles.delete(start),
		remaining = new Set(tiles),
		paths = [{ pos: start, score: 0, path: [ start ] }]
			.while(
				v => v.every(({ pos }) => pos.pos !== end.pos),
				v => v.sort((a, b) => a.score - b.score)
					.flatMap(({ pos, score, path }, i) => i !== 0 ? { pos, score, path } : pos.neighbors4(false)
						.filter(n => remaining.has(n.pos))
						.map(n => (remaining.delete(n.pos), { pos: n, score: score + 1, path: [ ...path, n ] }))
					)
			),
		paths.find(p => p.pos.pos === end).path
	))
	.run(path => (
		path.flatMap((f, i) => path.slice(i+1).map(t => [f, t]))
			.filter(([a, b]) => (d = a.sub(b), Math.abs(d.x) + Math.abs(d.y)) <= 20)
			.map(([a, b]) => path.indexOf(b) - path.indexOf(a) - (d = a.sub(b), Math.abs(d.x) + Math.abs(d.y)))
			.filter(v => v >= 100)
			.length
	))
	.print();
