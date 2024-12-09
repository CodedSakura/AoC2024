const utils = require("../utils");

utils.read("input.txt")
	.chars()
	.map((v, i) => ({ size: Number(v), id: i % 2 == 0 ? i / 2 : -1 }))
	.run(a => a.reduceRight((list, file, i) => (file.id === -1 || file.moved ? list : (
		gap = list.find((g, k) => g.id === -1 && g.size >= file.size && k < i),
		gap ? (
			gap.size -= file.size,
			file.moved = true,
			list.splice(list.indexOf(file), 1, { id: -1, size: file.size }),
			list.splice(list.indexOf(gap), 0, file),
			list.filter(v => v.size !== 0)
		) : list
	)), a))
	// <debug note="print filesystem representation (multidigit, strip trailing empty space)">
	.run(d => (d.reduce(({ acc, idx }, { size, id }) => ({ 
			acc: acc + (id === -1 ? '....|' : id.toString(10).padStart(4,'0') + '|').repeat(size),
			idx: idx + size,
		}), { acc: "|", idx: 0 }).acc.replace(/(?:\.+\|)+$/, '').print(), d))
	// </debug>
	// <debug note="print filesystem representation (single digit)">
	// .run(d => (d.reduce(({ acc, idx }, { size, id }) => ({ 
	// 		acc: acc + (id === -1 ? '.' : id.toString(10)).repeat(size),
	// 		idx: idx + size,
	// 	}), { acc: "", idx: 0 }).acc.print(), d))
	// </debug>
	.reduce(({ acc, idx }, { size, id }) => (id === -1 ? ({ acc, idx: idx + size }) : { 
		acc: acc + (size)*(idx*2+size-1)/2 * id,
		idx: idx + size,
	}), { acc: 0, idx: 0 })
	.acc
	.print();

// 6347828145200 - too high
