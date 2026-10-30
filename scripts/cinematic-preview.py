"""Export exactly the modular cinematic interface as a self-contained offline HTML file."""
from pathlib import Path
import base64,json,re
ROOT=Path(__file__).resolve().parents[1]
def build(target):
    public=ROOT/'public';html=(public/'index.html').read_text()
    html=re.sub(r'<link rel="stylesheet" href="cinematic/styles.css">','',html)
    html=re.sub(r'<script type="module" src="cinematic/app.mjs"></script>','',html)
    css=(public/'cinematic/styles.css').read_text()
    art={p.stem:'data:image/avif;base64,'+base64.b64encode(p.read_bytes()).decode() for p in (public/'assets/cinematic').glob('*.avif')}
    if len(art)!=9: raise ValueError('Expected nine local world images')
    js=[]
    for filename in ['themes/worlds.mjs','model.mjs','cinematic/schema.mjs','cinematic/motion.mjs','cinematic/app.mjs']:
        source=(public/filename).read_text()
        source=re.sub(r'^import[^\n]*\n','',source,flags=re.M)
        source=re.sub(r'^export\s*\{[^\n]*\};?\n','',source,flags=re.M)
        source=re.sub(r'^export ','',source,flags=re.M)
        js.append(source)
    favicon=base64.b64encode((public/'cinematic/favicon.svg').read_bytes()).decode()
    html=html.replace('cinematic/favicon.svg','data:image/svg+xml;base64,'+favicon)
    html=html.replace('assets/cinematic/pirates.avif',art['pirates'])
    html=html.replace('</head>','<style>\n'+css+'\n</style></head>')
    script='globalThis.TEMAS_ART='+json.dumps(art)+';\n(()=>{\n'+'\n'.join(js)+'\n})();'
    html=html.replace('</body>','<script>\n'+script.replace('</script','<\\/script')+'\n</script></body>')
    target=Path(target);target.parent.mkdir(parents=True,exist_ok=True);target.write_text(html)
    return html
if __name__=='__main__':
    import sys
    target=sys.argv[1] if len(sys.argv)>1 else ROOT/'test-results/Temas-cinematic.html'
    build(target);print(target)
