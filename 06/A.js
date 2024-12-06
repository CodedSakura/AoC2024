const utils = require("../utils");

utils.read("input.txt")
	.chars2d()
	.run((map) => ({
		start: map.findIndex2d(v => v === '^'),
		map,
		size: [ map.length, map[0].length ],
	}))
	.run(({ map, start, size }) => ({
		pos: start,
		dir: [ -1, 0, "up" ],
		rotate: {
			"up": [ 0, 1, "right" ],
			"right": [ 1, 0, "down" ],
			"down": [ 0, -1, "left" ],
			"left": [ -1, 0, "up" ],
		},
		size,
		map: (map[start[0]][start[1]] = '.', map),
		visited: new Set([ start[0] * size[1] + start[1] ]),
	}))
	.while(
		({ pos, size, dir }) => pos.inBounds(size),
		({ pos, dir, rotate, size, map, visited }) => ({
			pos: pos.add(dir),
			dir: (map[pos[0]+dir[0]*2]??[])[pos[1]+dir[1]*2] == '#' ? rotate[dir[2]] : dir,
			visited: (visited.add(pos[0] * size[1] + pos[1]), visited),
			rotate,
			size,
			map,
		}),
	)
	.run(({ visited, map, pos, dir, size: [ , width ] }) => ({
		pos,
		dir,
		visited: (map.map2d((c, x, y) => visited.has(y * width + x) ? 'x' : c)
			.map(v => v.join("")).join("\n").print(), visited),
	}))
	.run(({ visited }) => visited.size)
	.print();
