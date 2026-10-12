"""Verify deployed HTTPS pages and search discovery with the inherited proxy."""
import json
import subprocess
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

BASE = 'https://rainc.tech'
PATHS = ['/', '/products/', '/about/', '/updates/', '/contact/', '/privacy/', '/terms/']


def fetch(url):
    return subprocess.check_output(['curl', '--fail', '--silent', '--show-error', '--max-time', '30', url]).decode()


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = None
        self.robots = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')
        if tag == 'meta' and attrs.get('name') == 'robots':
            self.robots = attrs.get('content')


robots = fetch(BASE + '/robots.txt')
assert 'Allow: /' in robots and 'Sitemap: ' + BASE + '/sitemap.xml' in robots
root = ET.fromstring(fetch(BASE + '/sitemap.xml'))
locations = [e.text for e in root.findall('{*}url/{*}loc')]
assert set(locations) == {BASE + p for p in PATHS}
results = []
for path in PATHS:
    page = Metadata()
    page.feed(fetch(BASE + path))
    assert page.canonical == BASE + path, path
    assert page.robots == 'index, follow', path
    results.append({'url': BASE + path, 'canonical': page.canonical, 'robots': page.robots})
fetch('https://precidoc.rainc.tech/sample')
Path('review/v2/public-verification.json').write_text(json.dumps({'checked_on': '2026-10-12', 'pages': results, 'sitemap': 'valid seven canonical URLs', 'robots': 'allows public indexing', 'precidoc_sample': 'HTTP 200'}, indent=2) + '\n')
print('Public HTTPS verification passed: seven pages, canonical URLs, robots, sitemap and Precidoc sample entry.')
