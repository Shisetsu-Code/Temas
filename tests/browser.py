"""Browser acceptance tests. pip install playwright && playwright install chromium.
Start npm run dev first. CHROMIUM_PATH is optional for a system browser.
"""
import os, unittest
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
URL = os.getenv('BASE_URL', 'http://127.0.0.1:4173')

class LobbyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(**({'executable_path':os.environ['CHROMIUM_PATH']} if os.getenv('CHROMIUM_PATH') else {}))
    @classmethod
    def tearDownClass(cls):
        cls.browser.close(); cls.pw.stop()
    def setUp(self):
        self.context = self.browser.new_context(viewport={'width':1440,'height':1000}, reduced_motion='reduce')
        self.page = self.context.new_page()
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.goto(URL)
    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])
    def test_catalog_search_and_reset(self):
        expect(self.page.locator('.game-card')).to_have_count(12)
        self.page.get_by_role('searchbox').fill('orbita')
        expect(self.page.locator('.game-card')).to_have_count(1)
        self.page.get_by_role('searchbox').fill('<script>')
        expect(self.page.locator('#empty-state')).to_be_visible()
        self.page.get_by_role('button',name='Limpiar filtros').click()
        expect(self.page.locator('.game-card')).to_have_count(12)
    def test_filters_and_favorites_survive_reload(self):
        self.page.locator('.categories [data-category="live"]').click()
        expect(self.page.locator('.game-card')).to_have_count(3)
        self.page.locator('#provider').select_option('Nórd Studio')
        expect(self.page.locator('.game-card')).to_have_count(2)
        self.page.locator('.categories [data-category="all"]').click()
        self.page.locator('#provider').select_option('all')
        self.page.get_by_role('button',name='Guardar Órbita en favoritos',exact=True).click()
        self.page.reload()
        self.page.locator('.categories [data-category="favorites"]').click()
        expect(self.page.locator('.game-card')).to_have_count(1)
    def test_theme_and_motion_are_persistent(self):
        self.page.locator('#open-studio').click()
        self.page.get_by_role('button',name='Ascua',exact=False).click()
        expect(self.page.locator('html')).to_have_attribute('data-theme','ascua')
        self.page.locator('#motion').uncheck()
        self.page.keyboard.press('Escape')
        self.page.reload()
        expect(self.page.locator('html')).to_have_attribute('data-theme','ascua')
        expect(self.page.locator('html')).to_have_attribute('data-motion','off')
    def test_preview_is_honest_and_focus_returns(self):
        button = self.page.get_by_role('button',name='Ver Órbita',exact=True)
        button.click()
        expect(self.page.locator('#detail-dialog')).to_be_visible()
        expect(self.page.locator('#detail-dialog')).to_contain_text('No hay apuestas ni premios reales')
        self.page.keyboard.press('Escape')
        expect(button).to_be_focused()
    def test_invalid_storage_is_recovered(self):
        self.page.evaluate("localStorage.setItem('temas:v1', '{corrupt')")
        self.page.reload()
        expect(self.page.locator('.game-card')).to_have_count(12)
        expect(self.page.locator('html')).to_have_attribute('data-theme','base')
    def test_mobile_and_desktop_have_no_horizontal_overflow(self):
        for width in [360,390,768,1024,1440,1920]:
            self.page.set_viewport_size({'width':width,'height':900})
            self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth'), width, f'overflow at {width}')
        self.page.set_viewport_size({'width':390,'height':844})
        self.page.locator('#open-studio').click()
        expect(self.page.locator('#studio-dialog')).to_be_visible()
        self.assertLessEqual(self.page.locator('#studio-dialog').bounding_box()['width'],390)
    def test_no_external_requests_and_reduced_motion(self):
        requests=[]
        self.page.on('request', lambda req: requests.append(req.url))
        self.page.reload()
        self.assertTrue(all(url.startswith(URL) for url in requests))
        self.assertEqual(self.page.locator('.hero-art').evaluate('(el)=>getComputedStyle(el).animationName'), 'none')
    def test_account_is_not_a_fake_login(self):
        self.page.get_by_role('button',name='Ingresar',exact=True).click()
        expect(self.page.locator('#info-dialog')).to_contain_text('no solicita contraseñas')
        expect(self.page.locator('input[type=password]')).to_have_count(0)
    def test_screenshots(self):
        out = Path(os.getenv('SCREENSHOT_DIR','test-results')); out.mkdir(parents=True,exist_ok=True)
        self.page.screenshot(path=str(out/'desktop.png'),full_page=True,animations='disabled')
        self.page.set_viewport_size({'width':390,'height':844})
        self.page.screenshot(path=str(out/'mobile.png'),full_page=True,animations='disabled')

if __name__ == '__main__': unittest.main(verbosity=2)
