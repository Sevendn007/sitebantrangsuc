import urllib.request
from bs4 import BeautifulSoup
import json
import re

url = "https://web-dev.vankhanhjewelry.com.vn/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
soup = BeautifulSoup(html, 'html.parser')

links = []
for a in soup.find_all('a', href=True):
    links.append(a['href'])

print("All links:", list(set(links)))

script_tags = soup.find_all('script')
for script in script_tags:
    if script.string and '{"' in script.string:
        print("Found JSON script tag length:", len(script.string))
