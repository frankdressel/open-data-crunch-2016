#! /usr/bin/Rscript
library(data.table)
library(Hmisc)

cleanActual=data.table(read.table('combined.txt', fill=T, sep=','))
names=c('Date','Time','BEN','NO','NO2','O3','PM2.5','PM10','SO')
names(cleanActual)=names
cleanActual=cleanActual[, lapply(.SD, mean), by=Date]
for(name in c('BEN','NO','NO2','O3','PM2.5','PM10','SO')){
    cleanActual[[name]]=impute(cleanActual[[name]], mean)
}
write.csv(cleanActual, 'cleanActual.csv')

historical=data.table(read.table('~/open-data-crunch-2016/data/mergedweather.csv', fill=T, header=T, sep=';'))

setkey(cleanActual, 'Date')
setkey(historical, 'MESS_DATUM')
joined=cleanActual[historical]

write.csv(joined, 'joined.csv')
