import csv
from math import radians, sin, cos, sqrt, atan2
from itertools import combinations

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Raio da Terra em km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))
    
lista_aeros = ["GRU", "CGH", "GIG", "BSB", "SDU", "CNF", "JPA", "AJU", "THE"]

# Lista de aeroportos brasileiros
brasil = []
with open('airports_filtered.dat', newline='') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        if row[0] in lista_aeros:
            iata = row[0]
            nome = row[4]
            lat = float(row[5])
            lon = float(row[6])
            brasil.append((iata, nome, lat, lon))

# Salva o resultado em CSV
with open('paths.dat', mode='w', newline='') as outfile:
    writer = csv.writer(outfile)
    writer.writerow(['aeroporto1', 'aeroporto2', 'distancia'])

    for (iata1, _, lat1, lon1), (iata2, _, lat2, lon2) in combinations(brasil, 2):
        dist = haversine(lat1, lon1, lat2, lon2)
        if dist > 100:
        	writer.writerow([iata1, iata2, f"{dist:.2f}"])

