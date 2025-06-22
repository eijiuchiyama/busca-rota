import csv
from math import radians, sin, cos, sqrt, atan2, floor
from itertools import combinations
import random
from datetime import datetime, timedelta

inicio = datetime(2025, 7, 1, 0, 0, 0)
fim = datetime(2025, 7, 31, 23, 59, 59)

rotas = []
with open('paths.dat', newline='') as csvfile:
	reader = csv.reader(csvfile)
	for row in reader:
		iata1 = row[0]
		iata2 = row[1]
		distancia = float(row[2])
		rotas.append((iata1, iata2, distancia))
            
with open('flights.dat', mode='w', newline='') as outfile:
	writer = csv.writer(outfile)
	writer.writerow(['origem', 'destino', 'partida', 'chegada', 'companhia', 'preco_economica', 'preco_executiva', 'preco_primeira'])

	delta_segs = int((fim - inicio).total_seconds())
	for (iata1, iata2, distancia) in rotas:
		rand = random.randint(1,5)
		for j in range(rand):
			seg1 = random.randint(0, delta_segs)
			partida1 = inicio + timedelta(seconds=seg1)
			velocidade = random.randint(300,800)
			chegada1 = partida1 + timedelta(seconds = distancia/velocidade*3600)
			
			companhia = random.randint(0, 600)
			
			seg2 = random.randint(0, delta_segs)
			partida2 = inicio + timedelta(seconds=seg2)
			chegada1 = partida2 + timedelta(seconds = distancia/velocidade*3600)
			
			preco_por_km_econ = random.uniform(0.2, 0.5) 
			preco_economica = round(distancia * preco_por_km_econ,2)
			
			preco_por_km_exec = random.uniform(2.0, 4.0) 
			preco_executiva = round(distancia * preco_por_km_exec,2)
			
			preco_por_km_prim = random.uniform(8.0, 12.0) 
			preco_primeira = round(distancia * preco_por_km_prim,2)
			
			writer.writerow([iata1, iata2, partida1.isoformat(), chegada1.isoformat(), companhia, preco_economica, preco_executiva, preco_primeira])
			writer.writerow([iata2, iata1, partida2.isoformat(), chegada2.isoformat(), companhia, preco_economica, preco_executiva, preco_primeira])
			

