const utils = require("../utils");

utils.read("input.txt")
	.run(s => /^Register .: (\d+)\nRegister .: (\d+)\nRegister .: (\d+)\n\nProgram: (.+)$/.exec(s).collect())
	.run(([ , a, b, c, prog ]) => ({
		a: Number(a),
		b: Number(b),
		c: Number(c),
		program: prog.split(",").map(Number),
		ip: 0,
		out: [],
	}))
	.while(
		({ ip, program }) => ip < program.length,
		data => (
			combo = o => o <= 3 ? o : o === 4 ? data.a : o === 5 ? data.b : o === 6 ? data.c : NaN,
			[
				// adv
				o => data.a = data.a >> combo(o),
				// bxl
				o => data.b = data.b ^ o,
				// bst
				o => data.b = combo(o) & 0b111,
				// jnz
				o => data.a === 0 ? null : data.ip = o - 2,
				// bxc
				o => data.b = data.b ^ data.c,
				// out
				o => data.out.push(combo(o) & 0b111),
				// bdv
				o => data.b = data.a >> combo(o),
				// cdv
				o => data.c = data.a >> combo(o),
			][data.program[data.ip]](data.program[data.ip+1]),
			data.ip += 2,
			data
		)
	)
	.out.join(",")
	.print();
