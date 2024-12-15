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
	.run(({ moves, walls, boxes, start, map }) => ({
		moves,
		walls: new Set(walls.collect().flatMap(w => [ new Pos(w.x * 2, w.y), new Pos(w.x * 2 + 1, w.y) ])),
		boxesL: new Set(boxes.collect().map(b => new Pos(b.x * 2, b.y))),
		boxesR: new Set(boxes.collect().map(b => new Pos(b.x * 2 + 1, b.y))),
		start: new Pos(start.x * 2, start.y),
		map: map.map(r => r.flatMap(v => [ v, v ])),
	}))
	.run((data) => (
		({ moves, walls, boxesL, boxesR, start: pos } = data),
		moves.forEach(m => (
			// <debug note="print map">
			// data.map.map2d((_, x, y) => (p = new Pos(x, y), 
			// 		p === pos ? '@' : 
			// 			data.boxesL.has(p) && data.boxesR.has(p) ? '!' :
			// 			boxesL.has(p) ? '[' : 
			// 			boxesR.has(p) ? ']' : 
			// 			walls.has(p) ? '#' : '.'))
			// 	.map(v => v.join('')).join('\n').print(),
			// </debug>
			boxes = [],
			canMove = m.isHorizontal() ? 
				!walls.has(pos.move(m).while(
					p => boxesL.has(p) || boxesR.has(p), 
					p => (boxes.push(p), p.move(m))
				)) : 
				([pos.move(m)].while(
					p => p.every(v => !walls.has(v)) && p.some(v => boxesL.has(v) || boxesR.has(v)),
					p => p.flatMap(v => (
						boxes.push(v),
						left = boxesL.has(v),
						boxes.push(v.move(left ? Dir.E : Dir.W)),
						[ v.move(m), v.move(m).move(left ? Dir.E : Dir.W) ]
					)).filter(v => boxesL.has(v) || boxesR.has(v))
				), boxes.every(b => !walls.has(b.move(m))) && !walls.has(pos.move(m))),
			canMove ? (
				pos = pos.move(m),
				boxes.unique().reverse().forEach(b => (
					list = boxesL.has(b) ? boxesL : boxesR,
					list.delete(b),
					list.add(b.move(m))
				))
			) : null
		)),
		{ ...data, pos }
	))
	// <debug note="print final map">
	// .run((data) => (data.map
	// 	.map2d((_, x, y) => (p = new Pos(x, y), 
	// 		p === data.pos ? '@' : 
	// 			data.boxesL.has(p) && data.boxesR.has(p) ? '!' :
	// 			data.boxesL.has(p) ? '[' : 
	// 			data.boxesR.has(p) ? ']' : 
	// 			data.walls.has(p) ? '#' : '.'))
	// 	.map(v => v.join('')).join('\n').print(), data))
	// </debug>
	.run(({ boxesL }) => boxesL.collect().map(b => b.x + b.y * 100))
	.sum()
	.print();
