#!/usr/bin/env python3

import attr

from datetime import datetime
from io import BytesIO, StringIO
import urllib, gzip
from urllib.request import Request, urlopen
from urllib.parse import quote_plus
from bs4 import BeautifulSoup

# Data source: Umwelt Sachsen
API_URL = 'http://www.umwelt.sachsen.de/umwelt/infosysteme/luftonline/recherche.aspx'

measure_type = {
    'hours': '45; 3600',
    'days': '21; 86400',
}
separator = '; '

# Begin Data Download part
@attr.s
class Station(object):
    id = attr.ib(default = str())
    name = attr.ib(default = str())
@attr.s
class Substance(object):
    id = attr.ib(default = str())
    name = attr.ib(default = str())
@attr.s
class LuftOnlineSiteConfig(object):
    data = attr.ib(default = set())
    stations = attr.ib(default = list())
    substances = attr.ib(default = list())
    measure_type = attr.ib(default = 'hours')
    event_validation = attr.ib(default = list())
    form_data = attr.ib(default = list())
    end_data = attr.ib(default = list())
    cookie = attr.ib(default = str())
    scrollY = attr.ib(default = str())
    reqs = attr.ib(default = 0)
    
    def get_live_data(self):
        self.read_stations()
        self.load_substances()
        self.get_csv_data()
    def _get_event_validation(self, soup):
        ids = [
            #'__EVENTTARGET',
            '__EVENTARGUMENT',
            '__LASTFOCUS',
            '__VIEWSTATE',
            '__VIEWSTATEGENERATOR',
            '__SCROLLPOSITIONX',
            '__SCROLLPOSITIONY',
            '__EVENTVALIDATION',
        ]
        d = list()
        for id in ids:
            try:
                if id == '__SCROLLPOSITIONY':
                    d.append((id, self.scrollY))
                else:
                    d.append((id, soup.find(id=id)['value']))
            except:
                d.append((id, ''))
        return d
    def read_stations(self):
        soup = self._get_string()
        self.scrollY = '343'
        stations = soup.find(id='ctl00_Inhalt_StationList')
        for i in stations.find_all('option'):
            self.stations.append(Station(id = i['value'], name = i.string))

        self.end_data = [
            ('ctl00$Inhalt$AZTag', ''),
            ('ctl00$Inhalt$AZMonat', ''),
            ('ctl00$Inhalt$AZJahr', ''),
            ('ctl00$Inhalt$EZTag', ''),
            ('ctl00$Inhalt$EZMonat', ''),
            ('ctl00$Inhalt$EZJahr', ''),
            ('ctl00$Inhalt$DiagrammOpt', 'Linie'),
        ]
        self.form_data = [('ctl00$Inhalt$StationList', self.stations[0].id)]
        self.event_validation = [('__EVENTTARGET', 'ctl00$Inhalt$StationList')]
        self.event_validation += self._get_event_validation(soup)
        soup = self._get_string()
        self.form_data += list(
            map(lambda x: ('ctl00$Inhalt$StationList', x.id), self.stations[1:])
        )
        self.event_validation = [('__EVENTTARGET', 'ctl00$Inhalt$StationList')]
        self.event_validation += self._get_event_validation(soup)
    def load_substances(self):
        soup = self._get_string()
        substances = soup.find(id='ctl00_Inhalt_SchadstoffList')
        for i in substances.find_all('option'):
            self.substances.append(Substance(id = i['value'], name = i.string))

        self.form_data += [('ctl00$Inhalt$SchadstoffList', self.substances[0].id)]
        self.event_validation = [
            ('__EVENTTARGET', 'ctl00$Inhalt$SchadstoffList'),
        ] + self._get_event_validation(soup)
        self._get_string()
        
        self.form_data += list(
            map(lambda x: ('ctl00$Inhalt$SchadstoffList', x.id), self.substances[1:])
        )
        #self.end_data = [
            #('ctl00$Inhalt$MwttList', '32; 2'),
            #('ctl00$Inhalt$LetzteList', '0'),
        #] + self.end_data
        self.event_validation = [
            ('__EVENTTARGET', 'ctl00$Inhalt$SchadstoffList'),
        ] + self._get_event_validation(soup)
        soup = self._get_string()
        
        print('**Setting mwttlist***')
        #self.event_validation = [
            #('__EVENTTARGET', 'ctl00$Inhalt$MwttList'),
        #] + self._get_event_validation(soup) 
        #soup = self._get_string()
        
        self.end_data = [
            ('ctl00$Inhalt$MwttList', '45; 3600'),
            #('ctl00$Inhalt$LetzteList', '0'),
        ] + self.end_data
        self.event_validation = [
            #('__EVENTTARGET', 'ctl00$Inhalt$MwttList'),
        ] + self._get_event_validation(soup) 
        soup = self._get_string()
        
        self.event_validation = [
            ('__EVENTTARGET', ''),
        ] + self._get_event_validation(soup)
        self.end_data = self.end_data[:2] + [
            ('ctl00$Inhalt$AZTag', '01'),
            ('ctl00$Inhalt$AZMonat', '10'),
            ('ctl00$Inhalt$AZJahr', '2016'),
            ('ctl00$Inhalt$EZTag', '10'),
            ('ctl00$Inhalt$EZMonat', '10'),
            ('ctl00$Inhalt$EZJahr', '2016'),
            ('ctl00$Inhalt$DiagrammOpt', 'Linie'),
            ('ctl00$Inhalt$BtnCsvDown', 'CSV-Download'),
        ]
        
    def get_csv_data(self):
        for i in self.event_validation:
            print(i) 
        for i in self.form_data:
            print(i) 
        soup = self._get_string()
        print(soup)

    def _get_string(self):
        form_data = self.event_validation + self.form_data + self.end_data
        if form_data:
            with open('_r{0}'.format(self.reqs), 'w') as f:
                for k,v in form_data:
                    if v:
                        f.write('{0}={1}\r\n'.format(k,v))
                    else:
                        f.write('{0}\r\n'.format(k))
                self.reqs+=1
            form_data = urllib.parse.urlencode(form_data).encode('utf-8')
            request = Request(API_URL, form_data)
            with open('_r{0}a'.format(self.reqs-1), 'w') as f:
                f.write(request.get_method())
                f.write(request.data.decode('utf-8'))
            input('... _r{0}'.format(self.reqs-1))
        else:
            request = Request(API_URL)
        request.add_header('Host', 'www.umwelt.sachsen.de')
        request.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0')
        request.add_header('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
        request.add_header('Accept-Language', 'en-GB,en;q=0.5')
        request.add_header('Accept-Encoding', 'gzip, deflate')
        request.add_header('Referer', 'http://www.umwelt.sachsen.de/umwelt/infosysteme/luftonline/recherche.aspx')
        if self.cookie:
            request.add_header('Cookie', self.cookie)
        request.add_header('Connection', 'keep-alive')
        request.add_header('Content-Type', 'application/x-www-form-urlencoded')
        request.add_header('Origin', 'http://www.umwelt.sachsen.de')
        request.add_header('Upgrade-Insecure-Requests', '1')
        print('***Request***')
        for k,v in request.headers.items():
            print('{0}: {1}'.format(k,v))
        response = urlopen(request)
        print('***Response***')
        print(response.info())
        if response.info().get('Set-Cookie'):
            self.cookie = response.info().get('Set-Cookie')
        if response.info().get('Content-Encoding') == 'gzip':
            buf = BytesIO(response.read())
            data = gzip.GzipFile(fileobj=buf).read()
        else:
            data = response.read()
        data = data.decode('utf-8')
        return BeautifulSoup(data, 'html.parser')

def get_page():
    h = LuftOnlineSiteConfig()
    h.get_live_data()
    return h

# End Data Download part

# Begin CSV Parsing (right now, manually downloaded)
@attr.s
class CityData(object):
    name = attr.ib()
    substances = attr.ib(default = list())
    units = attr.ib(default = list())
    data = attr.ib(default = dict())

import copy
@attr.s
class Conversor(object):
    cities = attr.ib(default = dict())
    substances = attr.ib(default = set())
    
    def convert_csv_part(self, buf):
        cities = copy.deepcopy(self.cities)
        l = buf.readline().split(';')
        l2 = buf.readline().split(';')
        city_names = list(map(lambda x: ' '.join(x.split(' ')[:-1]).strip(), l[1:]))
        substances = list(map(lambda x: x.split(' ')[-1].strip(), l[1:]))
        units = list(map(lambda x: x.strip(),  l2[1:]))
        for city in city_names:
            if not cities.get(city, False):
                cities[city] = CityData(name = city)
        for l in buf:
            l = l.replace('n. def.', '')
            l = list(map(lambda x: x.strip(), l.split(';')))
            time = '-'.join(['20' + l[0][6:8], l[0][3:5], l[0][:2]]) + l[0][8:]
            for city, substance, us, v in zip(city_names, substances, units, l[1:]):
                if not v:
                    continue
                if substance not in cities[city].substances:
                    cities[city].substances.append(substance)
                    self.substances.add((substance, us))
                    cities[city].units.append(us)
                    cities[city].data[substance] = dict()
                cities[city].data[substance][time] = v
        return cities
    
    def write_csv(self, city):
        substances = list(self.substances)
        substances.sort()
        f = open('data/{0}.csv'.format(city.name), 'w')
        f.write(separator.join(['Datum', 'Zeit'] + list(map(lambda x: x[0], substances))).strip() + '\n')
        f.write(separator.join(['dd-mm-yy', 'hh:mm'] + list(map(lambda x: x[1], substances))).strip() + '\n')
        timepoints = set()
        for y in [city.data[x].keys() for x in city.substances]:
            timepoints = timepoints.union(y)
        timepoints = list(timepoints)
        timepoints.sort()
        for t in timepoints:
            vs = list(map(lambda x: city.data.get(x[0], dict()).get(t, '').replace(',','.'), substances))
            f.write(separator.join(t.split(' ') + vs) + '\n')
        f.close()
    
    def convert_csv(self, data):
        data = data.split('Datum Zeit')
        for part in data:
            self.cities = self.convert_csv_part(StringIO(part))
            
        import os
        if not os.path.exists('data'):
            os.makedirs('data')
        with open('data/_cities.csv', 'w') as f:
            for c in self.cities.values():
                self.write_csv(c)
                f.write(c.name + '\n')
# End CSV Parsing

def main(filename = None):
    if filename is not None:
        return Conversor().convert_csv(open(filename, 'r').read())
    else:
      print(get_page())

if __name__ == '__main__':
    from optparse import OptionParser
    class OptParser(OptionParser):
        def format_epilog(self, formatter):
            return self.epilog
    parser = OptParser(epilog = """
This script deals with data from 
http://www.umwelt.sachsen.de/umwelt/infosysteme/luftonline/recherche.aspx

Without arguments it will try to download the latest version, this currently
fails due to the way their interface is built.

If called with --file FILE, where FILE has been manually downloaded from Umwelt
Sachsen, it generates developer friendlier CSV files in the data subdirectory.

File separator can be specified with --separator SEPARATOR.
""")
    parser.add_option(
        "-f", "--file",
        dest = "filename",
        default = None,
        help = u"CSV file to read data from",
    )
    parser.add_option(
        "-s", "--separator",
        dest = "separator",
        default = separator,
        help = u"Separator for the csv",
    )
  
    (options, arguments) = parser.parse_args()
    separator = options.separator
    main(options.filename)