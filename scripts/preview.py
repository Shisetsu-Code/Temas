"""Create a self-contained offline preview from the exact source modules (no dependencies)."""
from pathlib import Path
import re, base64
ROOT=Path(__file__).resolve().parents[1]
def build(destination):
    public=ROOT/'public'
    html=(public/'index.html').read_text()
    css='\n'.join((public/name).read_text() for name in ['styles.css','themes/worlds.css'])
    html=re.sub(r'<link[^>]+href="(?:styles.css|themes/worlds.css)"[^>]*>','',html)
    html=re.sub(r'<script[^>]+src="app.js"[^>]*>\s*</script>','',html)
    js=[]
    for name in ['themes/worlds.mjs','themes/art.mjs','model.mjs','themes/engine.mjs','app.js']:
        source=(public/name).read_text()
        source=re.sub(r'^import[^\n]*\n','',source,flags=re.M)
        source=re.sub(r'^export ','',source,flags=re.M)
        source=source.replace('assets/art.svg#','#')
        js.append(source)
    art=(public/'assets/art.svg').read_text()
    art=art.replace('<svg ', '<svg style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" ',1)
    html=html.replace('assets/art.svg#','#')
    favicon=base64.b64encode((public/'assets/favicon.svg').read_bytes()).decode()
    html=html.replace('assets/favicon.svg','data:image/svg+xml;base64,'+favicon)
    html=html.replace('</head>','<style>\n'+css+'\n</style>\n</head>')
    html=html.replace('<body>','<body>\n'+art)
    html=html.replace('</body>','<script>\n{\n'+'\n'.join(js)+'\n}\n</script>\n</body>')
    Path(destination).parent.mkdir(parents=True,exist_ok=True)
    Path(destination).write_text(html)
    return html
if __name__=='__main__':
    import sys
    target=sys.argv[1] if len(sys.argv)>1 else str(ROOT/'test-results/Temas-nueve-mundos.html')
    build(target);print(target)
