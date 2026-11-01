"""27-world acceptance suite. HTTP by default; OFFLINE_HTML tests an owned fixture only."""
import os, unittest
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
IDS=['pirates','olympus','cyberpunk','steampunk','space','western','candy','dinosaurs','phoenix','egypt','japan','china','india','vikings','atlantis','dragons','vampires','artdeco','masquerade','muertos','alchemy','ice','forest','racing','wasteland','eldorado','astral']
class ExpansionTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.pw=sync_playwright().start();args={'executable_path':os.environ['CHROMIUM_PATH']} if os.getenv('CHROMIUM_PATH') else {}
  cls.browser=cls.pw.chromium.launch(**args)
 @classmethod
 def tearDownClass(cls):cls.browser.close();cls.pw.stop()
 def setUp(self):
  self.context=self.browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce');self.page=self.context.new_page();self.errors=[]
  self.page.on('pageerror',lambda e:self.errors.append(str(e)))
  if os.getenv('OFFLINE_HTML'):self.page.set_content(Path(os.environ['OFFLINE_HTML']).read_text(),wait_until='load')
  else:self.page.goto(os.getenv('BASE_URL','http://127.0.0.1:4173'))
  self.page.wait_for_selector('html[data-ready=true]');self.page.wait_for_selector('html[data-icons-ready=true]')
 def tearDown(self):self.context.close();self.assertEqual(self.errors,[])
 def choose(self,id):
  self.page.locator('#world-trigger').click();self.page.locator(f'[data-world-choice="{id}"]').click()
  expect(self.page.locator('html')).to_have_attribute('data-world',id)
  expect(self.page.locator('#world-dialog')).not_to_be_visible()
 def test_counter_and_gallery(self):
  expect(self.page.locator('[data-world-choice]')).to_have_count(27)
  expect(self.page.locator('.world-choice-icons .theme-icon')).to_have_count(162)
  counter=self.page.locator('.main-nav [data-open-worlds]>span').last
  expect(counter).to_have_text('27')
  expect(self.page.locator('.main-nav [data-open-worlds] .theme-icon-art')).to_have_count(1)
  expect(self.page.locator('.world-pagination>span')).to_contain_text('/ 27')
 def test_all_worlds_load_their_own_art_and_icons(self):
  signatures=set()
  for id in IDS:
   self.choose(id)
   image=self.page.locator('#scene-image');expect(image).to_be_visible()
   self.assertTrue(image.evaluate('(n)=>n.complete && n.naturalWidth>100'))
   signatures.add(image.get_attribute('src'))
   for icon in self.page.locator('.category-deck .theme-icon').all():
    expect(icon).to_have_attribute('data-icon-family',id);expect(icon).to_have_attribute('data-icon-ready','true')
  self.assertEqual(len(signatures),27)
 def test_theme_filter_and_empty_state(self):
  self.page.locator('#world-trigger').click();self.page.locator('[data-universe-group=new]').click()
  expect(self.page.locator('[data-world-choice]:visible')).to_have_count(18)
  self.page.locator('#world-search').fill('ALQUIMIA');expect(self.page.locator('[data-world-choice]:visible')).to_have_count(1)
  self.page.locator('#world-search').fill('noexistexyz');expect(self.page.locator('#world-empty')).to_be_visible()
  self.page.locator('#world-search').fill('');self.page.locator('[data-universe-group=original]').click()
  expect(self.page.locator('[data-world-choice]:visible')).to_have_count(9)
 def test_catalog_favorites_focus_and_pause_preserved(self):
  self.page.locator('[data-favorite=orbita]').click();self.page.locator('#search').fill('orbita')
  for id in ['japan','alchemy','astral','pirates']:
   self.choose(id);expect(self.page.locator('.game-card')).to_have_count(1)
   expect(self.page.locator('[data-favorite=orbita]')).to_have_attribute('aria-pressed','true')
  self.page.locator('#world-trigger').click();self.page.keyboard.press('Escape');expect(self.page.locator('#world-trigger')).to_be_focused()
  self.assertEqual(self.page.locator('#atmosphere').get_attribute('data-running'),'false')
  self.page.locator('#motion-toggle').click();expect(self.page.locator('#motion-toggle')).to_have_attribute('aria-pressed','false')
 def test_six_widths_without_horizontal_overflow(self):
  for width in [360,390,768,1024,1440,1920]:
   self.page.set_viewport_size({'width':width,'height':950})
   for id in IDS[9:]:
    self.choose(id)
    self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth'),width,f'{id}/{width}')
    self.assertTrue(self.page.locator('#hero-title').evaluate('(n)=>n.scrollWidth<=n.clientWidth'),f'title {id}/{width}')
 def test_evidence(self):
  out=Path(os.getenv('SCREENSHOT_DIR','test-results'))/'expansion';out.mkdir(parents=True,exist_ok=True)
  for id in IDS[9:]:
   self.choose(id);self.page.screenshot(path=str(out/f'{id}-desktop.png'),animations='disabled')
  self.page.set_viewport_size({'width':390,'height':844});self.choose('japan')
  self.page.screenshot(path=str(out/'japan-mobile.png'),full_page=True,animations='disabled')
if __name__=='__main__':unittest.main(verbosity=2)
