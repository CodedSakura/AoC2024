const utils = require("../utils");
const { Pos } = utils;

utils.read("input.txt")
	.lines()
	.map(v => /p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/.exec(v).collect().slice(1).map(Number))
	.map(([ px, py, vx, vy ]) => ({ p: new Pos(px, py), v: new Pos(vx, vy) }))
	.run(robots => (
		size = new Pos(101, 103),
		space = Array.fromSize2d(size, () => 0),
		time = 100,
		robots.map(({ p, v }) => new Pos(
				((p.x + v.x * time) % size.x + size.x) % size.x,
				((p.y + v.y * time) % size.y + size.y) % size.y,
			))
			.forEach(p => space.set2d(p.x, p.y, space.get2d(p) + 1)),
		// <debug note="print map">
		// space.map2d(v => v === 0 ? '.' : (v % 10).toString(10)).map(v=>v.join("")).join("\n").print(),
		// </debug>
		quadCount = [ 0, 0, 0, 0, -Infinity ],
		space.map2d((v, x, y) => 
			quadCount[x == (size.x - 1) / 2 || y == (size.y - 1) / 2 ? 4 :
			x < size.x / 2 ? 
				(y < size.y / 2 ? 0 : 1) :
				(y < size.y / 2 ? 2 : 3)] += v),
		quadCount.filter(v => v > 0)
	))
	.product()
	.print();
