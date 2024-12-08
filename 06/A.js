const utils = require("../utils");
const { Pos, Dir } = utils;

utils.read("input.txt")
	.chars2d()
	.run((map) => ({
		start: map.findIndex2d(v => v === '^').toPos(Dir.N),
		map,
		size: map.size2d(),
	}))
	.run(({ map, start, size }) => ({
		pos: start,
		size,
		map: (map.set2d(start, '.'), map),
		visited: new Set(),
	}))
	.while(
		({ pos, size }) => pos.inBounds(size),
		({ pos, size, map, visited }) => ({
			pos: pos.move().while(
				p => map.get2d(p.move()) == '#', 
				d => d.cw(),
			),
			visited: visited.add(pos.pos),
			size,
			map,
		}),
	)
	.run(({ visited, map, pos, dir, size: [ , width ] }) => (
		// <debug note="visualize path">
		// map.map2d((c, x, y) => visited.has(new Pos(x, y)) ? 'x' : c)
		// 	.map(v => v.join("")).join("\n").print(), 
		// </debug>
		visited.size
	))
	.print();
