"""Native HTTP acceptance tests. Run npm run dev first; no external resources required."""
import os, unittest
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
URL=os.getenv('BASE_URL','http://127.0.0.1:4173')
IDS=['pirates','olympus','cyberpunk','steampunk','space','western','candy','dinosaurs','phoenix']
class CinematicTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.pw=sync_playwright().start()
  cls.browser=cls.pw.chromium.launch(**({'executable_path':os.environ['CHROMIUM_PATH']} if os.getenv('CHROMIUM_PATH') else {}))
 @classmethod
 def tearDownClass(cls):cls.browser.close();cls.pw.stop()
 def setUp(self):
  self.ctx=self.browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
  self.p=self.ctx.new_page();self.errors=[];self.requests=[]
  self.p.on('pageerror',lambda e:self.errors.append(str(e)))
  self.p.on('request',lambda r:self.requests.append(r.url))
  self.p.goto(URL);expect(self.p.locator('html')).to_have_attribute('data-ready','true')
 def tearDown(self):self.ctx.close();self.assertEqual(self.errors,[])
 def choose(self,id):
  self.p.locator('#world-trigger').click();self.p.locator(f'[data-world-choice="{id}"]').click()
  expect(self.p.locator('html')).to_have_attribute('data-world',id)
  expect(self.p.locator('#world-dialog')).not_to_be_visible()
 def test_nine_illustrated_worlds_with_real_text(self):
  expect(self.p.locator('[data-world-choice]')).to_have_count(27)
  titles=[]
  for id in IDS:
   self.choose(id);titles.append(self.p.locator('#hero-title').inner_text())
   self.assertTrue(self.p.locator('#scene-image').evaluate('(n)=>n.complete&&n.naturalWidth>0'))
   expect(self.p.locator('#world-trigger')).to_be_focused()
  self.assertEqual(len(set(titles)),9)
 def test_filters_favorites_and_persistence(self):
  self.p.locator('[data-favorite="orbita"]').click()
  self.p.get_by_role('searchbox').fill('orbita');self.choose('phoenix')
  expect(self.p.locator('.game-card')).to_have_count(1)
  expect(self.p.locator('[data-favorite="orbita"]')).to_have_attribute('aria-pressed','true')
  self.p.reload();expect(self.p.locator('html')).to_have_attribute('data-world','phoenix')
  expect(self.p.locator('[data-favorite="orbita"]')).to_have_attribute('aria-pressed','true')
 def test_search_category_provider_reset(self):
  self.p.locator('[data-category="live"]').click();expect(self.p.locator('.game-card')).to_have_count(3)
  self.p.locator('#provider').select_option('Nórd Studio');expect(self.p.locator('.game-card')).to_have_count(2)
  self.p.get_by_role('searchbox').fill('<script>');expect(self.p.locator('#empty-state')).to_be_visible()
  self.p.locator('#reset-filters').click();expect(self.p.locator('.game-card')).to_have_count(12)
 def test_url_and_corrupt_storage(self):
  self.p.goto(URL+'?theme=constructor');expect(self.p.locator('html')).to_have_attribute('data-world','pirates')
  self.p.goto(URL+'?theme=cyberpunk');expect(self.p.locator('html')).to_have_attribute('data-world','cyberpunk')
  self.p.evaluate("localStorage.setItem('temas:v1','{oops')");self.p.goto(URL)
  expect(self.p.locator('html')).to_have_attribute('data-world','pirates')
 def test_blocked_storage(self):
  self.p.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})")
  self.p.reload();self.choose('space');expect(self.p.locator('.game-card')).to_have_count(12)
 def test_dialogs_and_honest_accounts(self):
  trigger=self.p.get_by_role('button',name='Ver Órbita',exact=True);trigger.click()
  expect(self.p.locator('#game-dialog')).to_contain_text('No hay apuestas ni premios reales')
  self.p.keyboard.press('Escape');expect(trigger).to_be_focused()
  self.p.locator('.login').click();expect(self.p.locator('#info-dialog')).to_contain_text('no solicita contraseñas')
  expect(self.p.locator('input[type=password]')).to_have_count(0)
 def test_motion_gates(self):
  expect(self.p.locator('#atmosphere')).to_have_attribute('data-running','false')
  self.p.emulate_media(reduced_motion='no-preference')
  expect(self.p.locator('#atmosphere')).to_have_attribute('data-running','true')
  self.p.locator('#world-trigger').click();expect(self.p.locator('#atmosphere')).to_have_attribute('data-running','false')
  self.p.keyboard.press('Escape');expect(self.p.locator('#atmosphere')).to_have_attribute('data-running','true')
  self.p.locator('#motion-toggle').click();expect(self.p.locator('#atmosphere')).to_have_attribute('data-running','false')
  self.p.reload();expect(self.p.locator('#motion-toggle')).to_have_attribute('aria-pressed','false')
 def test_all_viewports(self):
  for width in [360,390,768,1024,1440,1920]:
   self.p.set_viewport_size({'width':width,'height':1000})
   for id in IDS:
    self.choose(id)
    self.assertLessEqual(self.p.evaluate('document.documentElement.scrollWidth'),width,f'{id}/{width}')
    self.assertTrue(self.p.locator('#hero-title').evaluate('(n)=>n.scrollWidth<=n.clientWidth'),f'title overflow {id}/{width}')
 def test_no_external_requests_and_no_missing_art(self):
  for id in IDS:self.choose(id)
  self.assertTrue(all(u.startswith(URL) for u in self.requests))
  self.assertTrue(self.p.locator('#scene-image').evaluate('(n)=>n.naturalWidth>0'))
 def test_missing_art_is_not_a_broken_interface(self):
  self.p.route('**/assets/cinematic/phoenix.avif',lambda route:route.abort())
  self.choose('phoenix');expect(self.p.locator('.art-fallback')).to_be_visible()
  expect(self.p.locator('.game-card')).to_have_count(12)
 def test_visual_evidence(self):
  out=Path(os.getenv('SCREENSHOT_DIR','test-results'))/'cinematic';out.mkdir(parents=True,exist_ok=True)
  for id in IDS:
   self.choose(id);self.p.screenshot(path=str(out/f'{id}-desktop.png'),full_page=True,animations='disabled')
   self.p.locator('#hero').screenshot(path=str(out/f'{id}-hero.png'),animations='disabled')
   self.p.set_viewport_size({'width':390,'height':844});self.p.screenshot(path=str(out/f'{id}-mobile.png'),full_page=True,animations='disabled')
   self.p.set_viewport_size({'width':1440,'height':1000})
  self.p.locator('#world-trigger').click();self.p.screenshot(path=str(out/'selector.png'),animations='disabled')
if __name__=='__main__':unittest.main(verbosity=2)
