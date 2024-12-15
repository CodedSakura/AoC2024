const utils = require("../utils");
const { Pos, Dir } = utils;

utils.read("input.txt")
	.split("\n\n")
	.run(([ map, moves ]) => (map = map.chars2d(), {
		moves: moves.chars2d().flat().map((charMap = { '^': Dir.N, '>': Dir.E, 'v': Dir.S, '<': Dir.W }, v => charMap[v])),
		walls: new Set(map.map2d((v, x, y) => v === '#' ? new Pos(x, y) : undefined).flat().filter(v => v)),
		boxes: new Set(map.map2d((v, x, y) => v === 'O' ? new Pos(x, y) : undefined).flat().filter(v => v)),
		start: new Pos(map.findIndex2d(v => v === '@')),
		map,
	}))
	.run((data) => (
		({ moves, walls, boxes, start: pos } = data),
		moves.forEach(m => (
			canMove = !walls.has(pos.move(m).while(p => boxes.has(p), p => p.move(m))),
			canMove ? (
				pos = pos.move(m),
				boxes.has(pos) ? (
					boxes.delete(pos),
					boxes.add(pos.move(m).while(p => boxes.has(p), p => p.move(m)))
				) : null
			) : null
		)),
		{ ...data, pos }
	))
	// <debug note="print map">
	// .run((data) => (data.map
	// 	.map2d((_, x, y) => (p = new Pos(x, y), p === data.pos ? '@' : boxes.has(p) ? 'O' : walls.has(p) ? '#' : '.'))
	// 	.map(v => v.join('')).join('\n').print(), data))
	// </debug>
	.run(({ boxes }) => boxes.collect().map(b => b.x + b.y * 100))
	.sum()
	.print();
