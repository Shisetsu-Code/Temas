"""Export all worlds, atlases and icons as one offline HTML file. Standard library only."""
from pathlib import Path
import base64,json,re,subprocess
ROOT=Path(__file__).resolve().parents[1]
def build(target):
 public=ROOT/'public';html=(public/'index.html').read_text()
 for name in ['styles','icons','expansion']:
  html=re.sub(r'<link[^>]+href="cinematic/'+name+r'\.css"[^>]*>','',html)
 for name in ['app','icons']:
  html=re.sub(r'<script[^>]+src="cinematic/'+name+r'\.mjs"[^>]*>\s*</script>','',html)
 css='\n'.join((public/'cinematic'/f'{name}.css').read_text() for name in ['styles','icons','expansion'])
 def data(path):return 'data:image/avif;base64,'+base64.b64encode(path.read_bytes()).decode()
 art={p.stem:data(p) for p in (public/'assets/cinematic').glob('*.avif')}
 icons={p.stem:data(p) for p in (public/'assets/icons').glob('*.avif')}
 atlases={f'assets/expansion/{p.name}':data(p) for p in (public/'assets/expansion').glob('scenes-*.avif')}
 def bundle(files):
  out=[]
  for name in files:
   s=(public/name).read_text();s=re.sub(r'^import[^\n]*\n','',s,flags=re.M);s=re.sub(r'^export\s*\{[^\n]*\};?\n','',s,flags=re.M);s=re.sub(r'^export ','',s,flags=re.M);out.append(s)
  return '(()=>{\n'+'\n'.join(out)+'\n})();'
 app=bundle(['themes/worlds.mjs','model.mjs','cinematic/expansion.mjs','cinematic/expansion-art.mjs','cinematic/schema.mjs','cinematic/motion.mjs','cinematic/expansion-ui.mjs','cinematic/app.mjs'])
 icon_app=bundle(['cinematic/expansion.mjs','cinematic/expansion-icons.mjs','cinematic/icon-registry.mjs','cinematic/icons.mjs'])
 favicon=base64.b64encode((public/'cinematic/favicon.svg').read_bytes()).decode()
 html=html.replace('cinematic/favicon.svg','data:image/svg+xml;base64,'+favicon).replace('assets/cinematic/pirates.avif',art['pirates'])
 html=html.replace('</head>','<style id="expansion-styles">\n'+css+'\n</style></head>')
 script='globalThis.TEMAS_ART='+json.dumps(art)+';\nglobalThis.TEMAS_ICONS='+json.dumps(icons)+';\nglobalThis.TEMAS_ATLASES='+json.dumps(atlases)+';\n'+app+'\n'+icon_app
 html=html.replace('</body>','<script>\n'+script.replace('</script','<\\/script')+'\n</script></body>')
 target=Path(target);target.parent.mkdir(parents=True,exist_ok=True);target.write_text(html);return html
if __name__=='__main__':
 import sys
 target=sys.argv[1] if len(sys.argv)>1 else ROOT/'test-results/Temas-cinematic.html'
 build(target);print(target)
