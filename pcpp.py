import pypartpicker
import sys
import json
import time

parts = pypartpicker.part_search(' '.join(sys.argv[2:]), limit=int(sys.argv[1]))

list = []
for part in parts:
	product = pypartpicker.fetch_product(part.url)
	list.append({
		'name': product.name,
		'price': part.price,
		'image': part.image,
		'specs': product.specs,
	})
	if len(parts) > 1:
		time.sleep(2)

string = json.dumps(list)

print(string)

sys.stdout.flush()
