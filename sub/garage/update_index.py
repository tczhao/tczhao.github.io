#!/usr/bin/env python3
"""Inline garage.tsv into index.html as the LOG_TSV string.

Run from anywhere: python3 sub/garage/update_index.py
"""
import csv
import io
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
TSV = HERE / "garage.tsv"
HTML = HERE / "index.html"
LOG_LINE = re.compile(r'^const LOG_TSV = ".*";$', re.M)


def js_string(text):
    # "</" is escaped so a description containing "</script>" cannot end the inline script.
    return json.dumps(text, ensure_ascii=False).replace("</", "<\\/")


def vehicles_in_log(text):
    rows = list(csv.DictReader(io.StringIO(text), delimiter="\t"))
    return [r["Vehicle"].strip() for r in rows if (r.get("Item") or "").strip()]


def main():
    tsv = TSV.read_text(encoding="utf-8")
    html = HTML.read_text(encoding="utf-8")

    if len(LOG_LINE.findall(html)) != 1:
        sys.exit("expected exactly one `const LOG_TSV = \"...\";` line in index.html")

    # Rows whose Vehicle has no `match:` entry in VEHICLES vanish from the page silently.
    known = set(re.findall(r"match: '([^']+)'", html))
    log = vehicles_in_log(tsv)
    unknown = sorted(set(log) - known)
    if unknown:
        sys.exit(
            "Vehicle names in garage.tsv with no `match:` in VEHICLES (index.html):\n"
            + "".join(f"  {v}\n" for v in unknown)
            + "Known matches:\n"
            + "".join(f"  {v}\n" for v in sorted(known))
            + "Fix the TSV name, or update/add the VEHICLES entry, then rerun."
        )

    updated = LOG_LINE.sub(lambda _: f"const LOG_TSV = {js_string(tsv)};", html)
    if updated == html:
        print("index.html already up to date")
        return
    HTML.write_text(updated, encoding="utf-8")
    print(f"index.html updated: {len(log)} rows")
    for v in sorted(known):
        print(f"  {log.count(v):4d}  {v}")


if __name__ == "__main__":
    main()
