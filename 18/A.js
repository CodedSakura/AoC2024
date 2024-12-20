const utils = require("../utils");
const { Pos } = utils;

utils.read("input.txt")
	.numbers2d(",")
	.map(v => new Pos(v))
	.slice(0, 1024)
	.run(bytes => new Set(bytes))
	.run(bytes => (
		start = new Pos(0, 0),
		end = new Pos(70, 70),
		visited = new Set([ start ]),
		[{ pos: start, len: 0, path: [ start ] }].while(
			pos => pos.length > 0 && pos.every(p => p.pos !== end),
			pos => pos
				.sort((a, b) => a.len - b.len)
				.flatMap(({ pos, len, path }, i) => i !== 0 ? { pos, len, path } :
					pos.neighbors4(false)
						.filter(n => n.inBounds(end.add(1, 1)) && !visited.has(n) && !bytes.has(n))
						.map(n => ({ pos: n, len: len + 1, path: [ ...path, n ] })))
				.filter(p => (visited.add(p.pos), true))
		).find(v => v.pos == end)
	))
	.len
	.print();
