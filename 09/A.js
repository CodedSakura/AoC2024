const utils = require("../utils");

utils.read("input.txt")
	.chars()
	.map((v, i) => ({ size: Number(v), id: i % 2 == 0 ? i / 2 : -1 }))
	.while(
		a => a.some(({ id }) => id === -1),
		a => (
			gap = a.find(({ id }) => id === -1),
			gap.size >= a.last.size ? 
				(v = a.pop(), gap.size -= v.size, a.splice(a.indexOf(gap), 0, v)) :
				(a.last.size -= gap.size, gap.id = a.last.id),
			a.filter(v => v.size !== 0)
		),
	)
	.reduce(({ acc, idx }, { size, id }) => ({ 
		acc: acc + (size)*(idx*2+size-1)/2 * id,
		idx: idx + size,
	}), { acc: 0, idx: 0 })
	.acc
	.print();
