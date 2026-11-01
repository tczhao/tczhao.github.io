"""Regression checks for static generation and safe embedded content."""
import json
import shutil
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path
from unittest.mock import patch

import build


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.articles = 0
        self.scripts = []
        self.script_id = None
        self.in_script = False
        self.source_scripts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'article':
            self.articles += 1
        if tag == 'script':
            self.in_script = True
            self.script_id = attrs.get('id')
            if attrs.get('src'):
                self.source_scripts.append(attrs['src'])

    def handle_data(self, value):
        if self.in_script:
            self.scripts.append((self.script_id, value))

    def handle_endtag(self, tag):
        if tag == 'script':
            self.in_script = False


class StaticGenerationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.content = build.generate()
        cls.data = json.loads((build.ROOT / 'data/events.json').read_text())

    def test_all_content_is_prerendered_and_self_contained(self):
        parser = PageParser()
        parser.feed(self.content)
        self.assertEqual(parser.articles, len(self.data['events']))
        self.assertFalse(parser.source_scripts)
        self.assertNotIn("fetch(", self.content)
        self.assertNotIn('Serve this folder over HTTP', self.content)
        self.assertNotIn('<link rel="stylesheet"', self.content)
        embedded = json.loads(next(value for key, value in parser.scripts if key == 'timeline-data'))
        self.assertEqual(embedded['events'], self.data['events'])

    def test_build_is_deterministic_and_checked_in_html_is_current(self):
        self.assertEqual(self.content, build.generate())
        self.assertEqual(self.content, (build.ROOT / 'index.html').read_text())

    def test_embedded_data_cannot_close_its_script_element(self):
        with tempfile.TemporaryDirectory(prefix='worldlines-build-test-') as temporary:
            root = Path(temporary)
            shutil.copytree(build.ROOT / 'data', root / 'data')
            shutil.copytree(build.ROOT / 'templates', root / 'templates')
            for name in ('timeline.css', 'timeline.js'):
                shutil.copyfile(build.ROOT / name, root / name)
            data = json.loads((root / 'data/events.json').read_text())
            sentinel = '</script><script>window.untrusted = true</script>&'
            data['events'][0]['facts'] = sentinel
            (root / 'data/events.json').write_text(json.dumps(data))
            with patch.object(build, 'ROOT', root):
                content = build.generate()
            parser = PageParser()
            parser.feed(content)
            self.assertEqual(len(parser.scripts), 2)
            embedded = json.loads(next(value for key, value in parser.scripts if key == 'timeline-data'))
            self.assertEqual(embedded['events'][0]['facts'], sentinel)
            self.assertIn('&lt;/script&gt;', content)


if __name__ == '__main__':
    unittest.main()
