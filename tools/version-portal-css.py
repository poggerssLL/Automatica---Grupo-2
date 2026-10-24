"""Update the portal stylesheet's content hash in the five GitHub Pages files."""

from hashlib import sha256
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
css = (root / "doc/css/portal.css").read_text(encoding="utf-8").replace("\r\n", "\n")
version = sha256(css.encode("utf-8")).hexdigest()
pages = (
    "index.html",
    "doc/etapa-01-logica.html",
    "doc/etapa-02-grafos.html",
    "doc/planta-envasadora.html",
    "doc/diretrizes-github.html",
)
updated_pages = {}
for page in pages:
    path = root / page
    content = path.read_text(encoding="utf-8")
    updated, count = re.subn(r"(?<=portal\.css\?v=)[a-f0-9]+", version, content)
    if count != 1:
        raise RuntimeError(f"{page}: expected one portal.css version; found {count}")
    updated_pages[path] = updated

for path, content in updated_pages.items():
    path.write_text(content, encoding="utf-8", newline="\n")

print(version)
