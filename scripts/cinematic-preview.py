"""Export the modular interface, art and all themed icon strips as one offline HTML file."""
from pathlib import Path
import base64, json, re
ROOT=Path(__file__).resolve().parents[1]
WORLDS=('pirates','olympus','cyberpunk','steampunk','space','western','candy','dinosaurs','phoenix')
def build(target):
    public=ROOT/'public';html=(public/'index.html').read_text()
    for name in ['styles','icons']:
        html=html.replace(f'<link rel="stylesheet" href="cinematic/{name}.css">','')
    for name in ['app','icons']:
        html=html.replace(f'<script type="module" src="cinematic/{name}.mjs"></script>','')
    css='\n'.join((public/'cinematic'/f'{name}.css').read_text() for name in ['styles','icons'])
    def embedded(folder):
        return {world:'data:image/avif;base64,'+base64.b64encode((public/'assets'/folder/f'{world}.avif').read_bytes()).decode() for world in WORLDS}
    art=embedded('cinematic');icons=embedded('icons')
    def bundle(files):
        sources=[]
        for filename in files:
            source=(public/filename).read_text()
            source=re.sub(r'^import[^\n]*\n','',source,flags=re.M)
            source=re.sub(r'^export\s*\{[^\n]*\};?\n','',source,flags=re.M)
            source=re.sub(r'^export ','',source,flags=re.M)
            sources.append(source)
        return '(()=>{\n'+'\n'.join(sources)+'\n})();'
    app=bundle(['themes/worlds.mjs','model.mjs','cinematic/schema.mjs','cinematic/motion.mjs','cinematic/app.mjs'])
    icon_app=bundle(['cinematic/icon-registry.mjs','cinematic/icons.mjs'])
    favicon=base64.b64encode((public/'cinematic/favicon.svg').read_bytes()).decode()
    html=html.replace('cinematic/favicon.svg','data:image/svg+xml;base64,'+favicon)
    html=html.replace('assets/cinematic/pirates.avif',art['pirates'])
    html=html.replace('</head>','<style>\n'+css+'\n</style></head>')
    script='globalThis.TEMAS_ART='+json.dumps(art)+';\nglobalThis.TEMAS_ICONS='+json.dumps(icons)+';\n'+app+'\n'+icon_app
    html=html.replace('</body>','<script>\n'+script.replace('</script','<\\/script')+'\n</script></body>')
    target=Path(target);target.parent.mkdir(parents=True,exist_ok=True);target.write_text(html)
    return html
if __name__=='__main__':
    import sys
    target=sys.argv[1] if len(sys.argv)>1 else ROOT/'test-results/Temas-cinematic.html'
    build(target);print(target)
