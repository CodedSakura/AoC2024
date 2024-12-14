from PIL import Image, ImageDraw, ImageFont
import numpy as np
import glob

img = Image.new('1', (101, 114), 1)
data = img.load()
font = ImageFont.truetype("/usr/share/fonts/TTF/RobotoMono-Regular.ttf", 10)

for f in glob.glob("o-*.txt"):
	with open(f, 'r') as file:
		d = file.read()
		d = [ [ 1 if c == '.' else 0 for c in list(l) ] for l in d.split('\n') ]
		for x in range(101):
			for y in range(103):
				data[x,y] = d[y][x]
			for y in range(103, 114):
				data[x,y] = 1
	draw = ImageDraw.Draw(img)
	draw.text((77, 102), f[3:7], 0, font=font)
	img.save(f'{f}.png')
