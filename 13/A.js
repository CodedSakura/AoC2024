const utils = require("../utils");
const { Pos } = utils;

utils.read("input.txt")
	.run(v => v.split("\n\n"))
	.map(v => /X\+(\d+), Y\+(\d+)[\s\S]+X\+(\d+), Y\+(\d+)[\s\S]+X=(\d+), Y=(\d+)/m.exec(v).collect())
	.map(([ , ...values ]) => values.map(Number))
	.map(([ aX, aY, bX, bY, pX, pY ]) => ({
		a: new Pos(aX, aY),
		b: new Pos(bX, bY),
		p: new Pos(pX, pY),
	}))
	.map(({ a, b, p }) => ({ a, b, p, points: [ new Pos(0, 0), a, p, p.sub(b) ] }))
	.map(({ points: [ a, b, c, d ], ...rest }) => (
		det = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x),
		{
			intersection: new Pos(
				((a.x * b.y - a.y * b.x) * (c.x - d.x) - (a.x - b.x) * (c.x * d.y - c.y * d.x)) / det,
				((a.x * b.y - a.y * b.x) * (c.y - d.y) - (a.y - b.y) * (c.x * d.y - c.y * d.x)) / det,
			),
			...rest,
		}
	))
	.filter(({ intersection: { x, y } }) => x % 1 === 0 && y % 1 === 0)
	.map(({ intersection, a, b, p }) => intersection.x / a.x * 3 + (p.x - intersection.x) / b.x)
	.sum()
	.print();

