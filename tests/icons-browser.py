"""Acceptance tests against the real site. OFFLINE_HTML is an optional local-fixture mode."""
import os,unittest
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
URL=os.getenv('BASE_URL','http://127.0.0.1:4173')
OFFLINE=os.getenv('OFFLINE_HTML')
WORLDS=['pirates','olympus','cyberpunk','steampunk','space','western','candy','dinosaurs','phoenix']
class IconTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.pw=sync_playwright().start()
  cls.browser=cls.pw.chromium.launch(**({'executable_path':os.environ['CHROMIUM_PATH']} if os.getenv('CHROMIUM_PATH') else {}))
 @classmethod
 def tearDownClass(cls):cls.browser.close();cls.pw.stop()
 def setUp(self):
  self.ctx=self.browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
  self.page=self.ctx.new_page();self.errors=[];self.page.on('pageerror',lambda e:self.errors.append(str(e)))
  self.load()
 def load(self,broken=False):
  if OFFLINE:
   html=Path(OFFLINE).read_text()
   if broken:
    import json
    # Decode the registry regardless of JSON key order; leave hero art intact.
    start=html.index('globalThis.TEMAS_ICONS=')+len('globalThis.TEMAS_ICONS=')
    data,length=json.JSONDecoder().raw_decode(html[start:])
    data['pirates']='data:image/avif;base64,AAAA'
    html=html[:start]+json.dumps(data)+html[start+length:]
   self.page.set_content(html,wait_until='load')
  else:
   if broken:self.page.route('**/assets/icons/pirates.avif',lambda r:r.abort())
   self.page.goto(URL)
  self.page.wait_for_selector('html[data-ready=true]')
  self.page.wait_for_function("['true','error'].includes(document.documentElement.dataset.iconsReady)",timeout=10000)
 def tearDown(self):self.ctx.close();self.assertEqual(self.errors,[])
 def choose(self,id):
  self.page.locator('#world-trigger').click();self.page.locator(f'[data-world-choice="{id}"]').click()
  expect(self.page.locator('html')).to_have_attribute('data-world',id)
  expect(self.page.locator('#world-dialog')).not_to_be_visible()
 def test_54_approved_icons_in_gallery(self):
  expect(self.page.locator('html')).to_have_attribute('data-icons-ready','true')
  expect(self.page.locator('.world-choice-icons .theme-icon')).to_have_count(162)
  for world in WORLDS:
   expect(self.page.locator(f'[data-world-choice="{world}"] [data-icon-family="{world}"]')).to_have_count(6)
  expect(self.page.locator('.theme-icon .theme-icon')).to_have_count(0)
 def test_nine_distinct_families_and_repeated_switches(self):
  seen=set()
  for world in WORLDS*2:
   self.choose(world)
   icons=self.page.locator('.category-deck .theme-icon')
   expect(icons).to_have_count(5)
   for i in range(5):
    expect(icons.nth(i)).to_have_attribute('data-icon-family',world)
    expect(icons.nth(i)).to_have_attribute('data-icon-ready','true')
   seen.add(tuple(icons.evaluate_all('(ns)=>ns.map(n=>n.dataset.iconGlyph)')))
   expect(self.page.locator('.theme-icon .theme-icon')).to_have_count(0)
  self.assertEqual(len(seen),9)
 def test_buttons_filters_and_favorites_remain_functional(self):
  self.choose('phoenix')
  self.page.locator('[data-category="live"]').click();expect(self.page.locator('.game-card')).to_have_count(3)
  self.page.locator('[data-category="all"]').click()
  fav=self.page.locator('[data-favorite="orbita"]');fav.click()
  expect(self.page.locator('[data-favorite="orbita"]')).to_have_attribute('aria-pressed','true')
  expect(self.page.locator('[data-favorite="orbita"] .theme-icon')).to_have_attribute('data-icon-glyph','heart')
  self.page.get_by_role('searchbox').fill('orbita');expect(self.page.locator('.game-card')).to_have_count(1)
  self.choose('pirates')
  expect(self.page.locator('[data-favorite="orbita"]')).to_have_attribute('aria-pressed','true')
  expect(self.page.locator('[data-favorite="orbita"] .theme-icon')).to_have_attribute('data-icon-glyph','chest')
  expect(self.page.get_by_role('searchbox')).to_have_value('orbita')
 def test_utility_icons_are_not_replaced_and_focus_returns(self):
  expect(self.page.locator('#motion-toggle svg')).to_have_count(1)
  expect(self.page.locator('#world-next svg')).to_have_count(1)
  expect(self.page.locator('#world-next .theme-icon')).to_have_count(0)
  self.page.locator('#world-trigger').click();self.page.keyboard.press('Escape')
  expect(self.page.locator('#world-trigger')).to_be_focused()
  for el in self.page.locator('.theme-icon').all():expect(el).to_have_attribute('aria-hidden','true')
 def test_reduced_motion_and_manual_pause(self):
  icon=self.page.locator('[data-category="all"] .theme-icon-art')
  self.assertEqual(icon.evaluate('(n)=>getComputedStyle(n).transitionDuration'),'0s')
  self.page.emulate_media(reduced_motion='no-preference');self.page.locator('#hero').scroll_into_view_if_needed()
  self.page.locator('#motion-toggle').click()
  expect(self.page.locator('#motion-toggle')).to_have_attribute('aria-pressed','false')
  self.assertEqual(icon.evaluate('(n)=>getComputedStyle(n).transitionDuration'),'0s')
 def test_failed_strip_keeps_original_svg_and_clicks(self):
  self.ctx.close();self.ctx=self.browser.new_context(reduced_motion='reduce');self.page=self.ctx.new_page()
  self.page.on('pageerror',lambda e:self.errors.append(str(e)));self.load(broken=True)
  icon=self.page.locator('[data-category="slots"] .theme-icon')
  expect(icon).to_have_attribute('data-icon-ready','error')
  self.assertEqual(icon.locator('svg').evaluate('(n)=>getComputedStyle(n).visibility'),'visible')
  self.page.locator('[data-category="slots"]').click()
  self.assertGreater(self.page.locator('.game-card').count(),0)
 def test_six_viewports_each_world(self):
  for width in [360,390,768,1024,1440,1920]:
   self.page.set_viewport_size({'width':width,'height':920})
   for world in WORLDS:
    self.choose(world)
    self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth'),width,f'{world}/{width}')
 def test_capture_rendered_templates(self):
  out=Path(os.getenv('SCREENSHOT_DIR','test-results'))/'themed-icons';out.mkdir(parents=True,exist_ok=True)
  for world in WORLDS:
   self.choose(world)
   self.page.locator('.category-deck').screenshot(path=str(out/f'{world}-icons.png'))
   # Category crops are the visual regression target for this change.
  self.page.locator('#world-trigger').click()
  self.page.screenshot(path=str(out/'selector.png'),animations='disabled')
  self.page.keyboard.press('Escape');self.choose('pirates')
  self.page.screenshot(path=str(out/'desktop.png'),full_page=False,animations='disabled')
  self.page.set_viewport_size({'width':390,'height':844})
  self.page.screenshot(path=str(out/'mobile.png'),full_page=True,animations='disabled')
if __name__=='__main__':unittest.main(verbosity=2)
