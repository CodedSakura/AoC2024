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
		dir: [ 0, -1, "up", 0 ], // y, x, name, offset for caching
		rotate: {
			"up":    [  1,  0, "right", 1 ],
			"right": [  0,  1, "down",  2 ],
			"down":  [ -1,  0, "left",  3 ],
			"left":  [  0, -1, "up",    0 ],
		},
		size,
		map: (map[start[1]][start[0]] = '.', map),
		visited: new Set(),
		visitKey: ({ pos, size, dir }) => pos.flatIndex2d(size) + size.product() * dir[3],
		start,
	}))
	.while(
		({ pos, size, dir }) => pos.inBounds(size),
		({ pos, dir, rotate, size, map, visited, ...rest }) => ({
			pos: pos.add(dir),
			dir: dir.while(d => map.get2d(pos.add(dir, d)) == '#', d => rotate[d[2]]),
			visited: (visited.add(pos.flatIndex2d(size)), visited),
			rotate,
			size,
			map,
			...rest,
		}),
	)
	.run((data) => Array
		.from(data.visited)
		.map(v => v.unflatIndex2d(data.size))
		.map(([ x, y ]) => ({ 
			...data,
			visited: new Set(), 
			path: data.visited,
			obstacle: [ x, y ],
			pos: data.start,
			dir: [ 0, -1, "up", 0 ],
		})))
	.map((data, i) => (i, data)
		.while(
			({ pos, size, dir, visited, visitKey }) => pos.inBounds(size) && 
					!visited.has(visitKey({ pos, dir, size })),
			({ pos, dir, rotate, size, map, visited, visitKey, obstacle, ...rest }) => ({
				pos: pos.add(dir),
				dir: dir.while(
					d => map.get2d(pos.add(dir, d)) == '#' ||
						pos.add(dir, d).equals(obstacle),
					d => rotate[d[2]],
				),
				visited: (visited.add(visitKey({ pos, dir, size })), visited),
				rotate,
				size,
				map,
				visitKey,
				obstacle,
				...rest,
			}),
		)
	)
	.filter(({ pos, size, dir, visited, visitKey }) => visited.has(visitKey({ pos, dir, size })))
	// <debug note="visualize all obstacles that work">
	// .run(data => (data.first().map.map2d((c, x, y) => 
	// 		data.some(({ obstacle }) => obstacle[0] == x && obstacle[1] == y) ? 'O' : 
	// 		data.first().path.has(y * 130 + x) ? 'x' : c)
	// 	.map(v => v.join("")).join("\n").print(), data))
	// </debug>
	// <debug note="visualize all paths">
	// .map((data, i) => (i.print(), data.map.map2d((c, x, y) => 
	// 		x === data.obstacle[0] && y === data.obstacle[1] ? 'O' :
	// 		data.visited.has([ x, y ].flatIndex2d(data.size)) ? '^' : 
	// 		data.visited.has([ x, y ].flatIndex2d(data.size) + data.size[0] * data.size[1]) ? '>' : 
	// 		data.visited.has([ x, y ].flatIndex2d(data.size) + data.size[0] * data.size[1] * 2) ? 'v' : 
	// 		data.visited.has([ x, y ].flatIndex2d(data.size) + data.size[0] * data.size[1] * 3) ? '<' : 
	// 		c)
	// 		.map(v => v.join("")).join("\n").print(), data))
	// </debug>
	.length
	.print();
