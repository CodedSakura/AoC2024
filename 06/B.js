const utils = require("../utils");
const { Pos, PosRot } = utils;

utils.read("input.txt")
	.chars2d()
	.run((map) => ({
		start: map.findIndex2d(v => v === '^').toPos(PosRot.Up),
		map,
		size: map.size2d(),
	}))
	.run(({ map, start, size }) => ({
		pos: start,
		size,
		map: (map[start.y][start.x] = '.', map),
		visited: new Set(),
		start,
	}))
	.while(
		({ pos, size, dir }) => pos.inBounds(size),
		({ pos, dir, rotate, size, map, visited, ...rest }) => ({
			pos: pos.move().while(
				p => map.get2d(p.move()) == '#',
				d => d.cw(),
			),
			visited: visited.add(pos.pos),
			rotate,
			size,
			map,
			...rest,
		}),
	)
	.run((data) => Array
		.from(data.visited)
		.map(pos => ({ 
			...data,
			visited: new Set(), 
			path: data.visited,
			obstacle: pos,
			pos: data.start,
		})))
	.map((data, i) => (i, data)
		.while(
			({ pos, size, visited }) => pos.inBounds(size) && !visited.has(pos),
			({ pos, map, visited, obstacle, ...rest }) => ({
				pos: pos.move().while(
					p => map.get2d(p.move()) == '#' || p.move().pos === obstacle,
					p => p.cw(),
				),
				visited: visited.add(pos),
				map,
				obstacle,
				...rest,
			}),
		)
	)
	.filter(({ pos, size, dir, visited, visitKey }) => visited.has(pos))
	// <debug note="visualize all obstacles">
	// .run(data => (data.first.map.map2d((c, x, y) => 
	// 		data.some(({ obstacle }) => obstacle.x == x && obstacle.y == y) ? 'O' : 
	// 		data.first.path.has(y * 130 + x) ? 'x' : c)
	// 	.map(v => v.join("")).join("\n").print(), data))
	// </debug>
	// <debug note="visualize all paths">
	// .map((data, i) => (i.print(), data.map.map2d((c, x, y) => 
	// 		x === data.obstacle.x && y === data.obstacle.y ? 'O' :
	// 		data.visited.has(new PosRot(x, y, PosRot.N)) ? '^' : 
	// 		data.visited.has(new PosRot(x, y, PosRot.E)) ? '>' : 
	// 		data.visited.has(new PosRot(x, y, PosRot.S)) ? 'v' : 
	// 		data.visited.has(new PosRot(x, y, PosRot.W)) ? '<' : 
	// 		c)
	// 		.map(v => v.join("")).join("\n").print(), data))
	// </debug>
	.length
	.print();
