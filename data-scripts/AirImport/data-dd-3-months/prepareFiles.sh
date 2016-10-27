cat Dresden-Nord.csv Dresden-Bergstraße.csv Dresden-Winckelmannstr..csv | grep -P '07:00|08:00|09:00' | tr ',' '.' | tr ';' ',' > combined.txt
