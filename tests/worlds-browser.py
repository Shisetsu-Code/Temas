"""Theme acceptance tests. Start npm run dev first."""
import os, unittest
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
URL=os.getenv('BASE_URL','http://127.0.0.1:4173')
WORLDS=['pirates','olympus','cyberpunk','steampunk','space','western','candy','dinosaurs','phoenix']
class WorldTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw=sync_playwright().start()
        args={'executable_path':os.environ['CHROMIUM_PATH']} if os.getenv('CHROMIUM_PATH') else {}
        cls.browser=cls.pw.chromium.launch(**args)
    @classmethod
    def tearDownClass(cls):
        cls.browser.close();cls.pw.stop()
    def setUp(self):
        self.ctx=self.browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
        self.page=self.ctx.new_page();self.errors=[]
        self.page.on('pageerror',lambda e:self.errors.append(str(e)))
        self.page.goto(URL)
    def tearDown(self):
        self.ctx.close();self.assertEqual(self.errors,[])
    def choose(self,id):
        self.page.locator('#open-studio').click()
        self.page.locator(f'[data-theme-choice="{id}"]').click()
        self.page.keyboard.press('Escape')
    def test_selector_has_nine_worlds_plus_existing_palettes(self):
        self.page.get_by_role('button',name='Cambiar mundo').click()
        expect(self.page.locator('[data-world-option]')).to_have_count(9)
        expect(self.page.locator('[data-theme-choice]')).to_have_count(12)
    def test_every_world_replaces_scene_and_returns_to_base(self):
        original=self.page.locator('.hero h1').inner_text()
        for id in WORLDS:
            self.choose(id)
            expect(self.page.locator('html')).to_have_attribute('data-world',id)
            expect(self.page.locator('.world-scene svg')).to_have_attribute('data-scene',id)
            self.assertNotEqual(self.page.locator('.hero h1').inner_text(),original)
            self.assertEqual(self.page.evaluate('()=>{const a=[...document.querySelectorAll("[id]")].map(n=>n.id);return a.length-new Set(a).size;}'),0)
        self.choose('base')
        expect(self.page.locator('.hero h1')).to_have_text(original)
        expect(self.page.locator('.hero-art')).to_be_visible()
        expect(self.page.locator('.world-scene')).to_be_empty()
    def test_state_and_persistence(self):
        self.page.locator('[data-favorite="orbita"]').click()
        self.page.get_by_role('searchbox').fill('orbita')
        self.choose('phoenix')
        expect(self.page.locator('.game-card')).to_have_count(1)
        expect(self.page.locator('[data-favorite="orbita"]')).to_have_attribute('aria-pressed','true')
        self.page.reload()
        expect(self.page.locator('html')).to_have_attribute('data-theme','phoenix')
        expect(self.page.locator('[data-favorite="orbita"]')).to_have_attribute('aria-pressed','true')
    def test_viewports(self):
        for width in [360,390,768,1024,1440,1920]:
            self.page.set_viewport_size({'width':width,'height':920})
            for id in WORLDS:
                self.choose(id)
                self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth'),width,f'{id}/{width}')
                self.assertTrue(self.page.locator('.hero h1').evaluate('(n)=>n.scrollWidth<=n.clientWidth'),f'heading clips {id}/{width}')
    def test_motion_and_keyboard(self):
        self.choose('steampunk')
        spin=self.page.locator('.world-scene .world-spin').first
        self.assertEqual(spin.evaluate('(n)=>getComputedStyle(n).animationName'),'none')
        self.page.emulate_media(reduced_motion='no-preference')
        self.assertNotEqual(spin.evaluate('(n)=>getComputedStyle(n).animationName'),'none')
        self.page.locator('#open-studio').click();self.page.locator('#motion').uncheck()
        self.page.keyboard.press('Escape')
        expect(self.page.locator('#open-studio')).to_be_focused()
        self.assertEqual(spin.evaluate('(n)=>getComputedStyle(n).animationName'),'none')
    def test_url_theme(self):
        self.page.goto(URL+'?theme=constructor')
        expect(self.page.locator('html')).to_have_attribute('data-theme','base')
        self.page.goto(URL+'?theme=pirates')
        expect(self.page.locator('html')).to_have_attribute('data-theme','pirates')
        self.choose('phoenix');self.page.reload()
        expect(self.page.locator('html')).to_have_attribute('data-theme','phoenix')
    def test_blocked_storage(self):
        self.page.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}})")
        self.page.reload();self.choose('cyberpunk')
        expect(self.page.locator('html')).to_have_attribute('data-world','cyberpunk')
    def test_evidence(self):
        out=Path(os.getenv('SCREENSHOT_DIR','test-results'))/'worlds';out.mkdir(parents=True,exist_ok=True)
        for id in WORLDS:
            self.choose(id)
            self.page.screenshot(path=str(out/f'{id}-desktop.png'),full_page=True,animations='disabled')
            self.page.set_viewport_size({'width':390,'height':844})
            self.page.screenshot(path=str(out/f'{id}-mobile.png'),full_page=True,animations='disabled')
            self.page.set_viewport_size({'width':1440,'height':1000})
        self.page.locator('#open-studio').click()
        self.page.screenshot(path=str(out/'selector.png'),animations='disabled')
if __name__=='__main__':unittest.main(verbosity=2)
