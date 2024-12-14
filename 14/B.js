const utils = require("../utils");
const { Pos } = utils;

utils.read("input.txt")
	.lines()
	.map(v => /p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/.exec(v).collect().slice(1).map(Number))
	.map(([ px, py, vx, vy ]) => ({ p: new Pos(px, py), v: new Pos(vx, vy) }))
	.run(robots => (
		size = new Pos(101, 103),
		(0).while(
			t => t < 10000,
			t => (
				space = Array.fromSize2d(size, () => 0),
				robots.map(({ p, v }) => new Pos(
						((p.x + v.x * t) % size.x + size.x) % size.x,
						((p.y + v.y * t) % size.y + size.y) % size.y,
					))
					.forEach(p => space.set2d(p.x, p.y, space.get2d(p) + 1)),
				// <debug note="print map">
				space.map2d(v => v === 0 ? '.' : (v % 10).toString(10)).map(v=>v.join("")).join("\n").run(v => utils.write(`o-${t.toString().padStart(5, "0")}.txt`, v)),
				// </debug>
				t + 1
			)
		),
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
