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
		dir: [ -1, 0, "up", 0 ], // y, x, name, offset for caching
		rotate: {
			"up": [ 0, 1, "right", 1 ],
			"right": [ 1, 0, "down", 2 ],
			"down": [ 0, -1, "left", 3 ],
			"left": [ -1, 0, "up", 0 ],
		},
		size,
		map: (map[start[0]][start[1]] = '.', map),
		visited: new Set(),
		visitKey: ({ pos, size, dir }) => pos[0] * size[1] + pos[1] + size[0] * size[1] * dir[3],
		start,
	}))
	.while(
		({ pos, size, dir }) => pos.inBounds(size),
		({ pos, dir, rotate, size, map, visited, ...rest }) => ({
			pos: pos.add(dir),
			dir: (map[pos[0]+dir[0]*2]??[])[pos[1]+dir[1]*2] == '#' ? rotate[dir[2]] : dir,
			visited: (visited.add(pos[0] * size[1] + pos[1]), visited),
			rotate,
			size,
			map,
			...rest,
		}),
	)
	.run((data) => Array
		.from(data.visited)
		.map(v => (x = v % data.size[0], [ (v - x) / data.size[0], x ]))
		// .filter(([ x, y ]) => x !== data.pos[0] || y !== data.pos[1])
		.map(([ y, x ]) => ({ 
			...data,
			visited: new Set(), 
			obstacle: [ x, y ],
			pos: data.start,
			dir: [ -1, 0, "up", 0 ]
		})))
	.map((data, i) => (i.print(), data)
		.while(
			({ pos, size, dir, visited, visitKey }) => pos.inBounds(size) && 
					!visited.has(visitKey({ pos, dir, size })),
			({ pos, dir, rotate, size, map, visited, visitKey, obstacle }) => ({
				pos: pos.add(dir),
				dir: (
					(map[pos[0]+dir[0]*2]??[])[pos[1]+dir[1]*2] == '#' || 
						(pos[0]+dir[0]*2 == obstacle[1] && pos[1]+dir[1]*2 == obstacle[0]) ? 
					rotate[dir[2]] :
					dir
				),
				visited: (visited.add(visitKey({ pos, dir, size })), visited),
				rotate,
				size,
				map,
				visitKey,
				obstacle,
			}),
		)
	)
	.filter(({ pos, size, dir, visited, visitKey }) => visited.has(visitKey({ pos, dir, size })))
	// .map((data, i) => (i.print(), data.map.map2d((c, x, y) => 
	// 		x === data.obstacle[0] && y === data.obstacle[1] ? 'O' :
	// 		data.visited.has(y * data.size[1] + x) ? '^' : 
	// 		data.visited.has(y * data.size[1] + x + data.size[0] * data.size[1]) ? '>' : 
	// 		data.visited.has(y * data.size[1] + x + data.size[0] * data.size[1] * 2) ? 'v' : 
	// 		data.visited.has(y * data.size[1] + x + data.size[0] * data.size[1] * 3) ? '<' : 
	// 		c)
	// 		.map(v => v.join("")).join("\n").print(), data))
	.length
	.print();

// 6 on test input
// real input takes 4s
// 1345 - too low
// 1430 - too low, not off-by-1
