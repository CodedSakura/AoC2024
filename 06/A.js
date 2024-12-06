const utils = require("../utils");

utils.read("input.txt")
	.chars2d()
	.run((map) => ({
		start: map.findIndex2d(v => v === '^'),
		map,
		size: map.size2d(),
	}))
	.run(({ map, start, size }) => ({
		pos: start,
		dir: [ 0, -1, "up" ],
		rotate: {
			"up":    [  1,  0, "right" ],
			"right": [  0,  1, "down"  ],
			"down":  [ -1,  0, "left"  ],
			"left":  [  0, -1, "up"    ],
		},
		size,
		map: (map[start[1]][start[0]] = '.', map),
		visited: new Set([ start.flatIndex2d(size) ]),
	}))
	.while(
		({ pos, size, dir }) => pos.inBounds(size),
		({ pos, dir, rotate, size, map, visited }) => ({
			pos: pos.add(dir),
			dir: dir.while(d => map.get2d(pos.add(dir, d)) == '#', d => rotate[d[2]]),
			visited: (visited.add(pos.flatIndex2d(size)), visited),
			rotate,
			size,
			map,
		}),
	)
	.run(({ visited, map, pos, dir, size: [ , width ] }) => ({
		pos,
		dir,
		visited: (map.map2d((c, x, y) => visited.has(x * width + y) ? 'x' : c)
			.map(v => v.join("")).join("\n").print(), visited.print()),
	}))
	.run(({ visited }) => visited.size)
	.print();
