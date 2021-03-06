#! /usr/bin/Rscript
library(data.table)
library(Hmisc)
library(randomForest)

cleanActual=data.table(read.table('combined.txt', fill=T, sep=','))
names=c('Date','Time','BEN','NO','NO2','O3','PM2.5','PM10','SO')
names(cleanActual)=names
for(name in c('BEN','NO','NO2','O3','PM2.5','PM10','SO')){
    cleanActual[[name]]=impute(cleanActual[[name]], mean)
}
cleanActual=cleanActual[, lapply(.SD, mean), by=Date]
write.csv(cleanActual, 'cleanActual.csv')

historical=data.table(read.table('~/open-data-crunch-2016/data/mergedweather.csv', fill=T, header=T, sep=';'))

setkey(cleanActual, 'Date')
setkey(historical, 'MESS_DATUM')
joined=cleanActual[historical]

joined=joined[complete.cases(joined)]

write.csv(joined, 'joined.csv')

#"","Date","Time","BEN","NO","NO2","O3","PM2.5","PM10","SO","WEEK_DAY","LUFTTEMPERATUR1","LUFTTEMPERATUR2","LUFTTEMPERATUR3","REL_FEUCHTE1","REL_FEUCHTE2","REL_FEUCHTE3","WINDGESCHWINDIGKEIT1","WINDGESCHWINDIGKEIT2","WINDGESCHWINDIGKE    IT3","WINDRICHTUNG1","WINDRICHTUNG2","WINDRICHTUNG3"

joined$smog=joined[,PM2.5>10]

write.csv(joined, 'smog.csv')

fit <- randomForest(as.factor(smog) ~ WEEK_DAY + LUFTTEMPERATUR1 + LUFTTEMPERATUR2 + LUFTTEMPERATUR3 + WINDGESCHWINDIGKEIT1 + WINDGESCHWINDIGKEIT2 + WINDGESCHWINDIGKEIT3, data=joined, importance=T)

png('test.png', 800, 600)
varImpPlot(fit)
dev.off()
