import glob
import re

new_social = '''        <div class="footer-social">
          <a href="https://www.facebook.com/profile.php?id=61590507447571" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
          <a href="https://www.instagram.com/marfatiastockbroking/" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
          <a href="https://t.me/MarfatiaStockBroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Telegram"><i class="bi bi-telegram"></i></a>
          <a href="https://www.youtube.com/@MarfatiaStockBroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
          <a href="https://whatsapp.com/channel/0029VbA6L3M7YSd8T7Yxyz" target="_blank" rel="noopener" class="footer-social-ico" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
          <a href="https://www.linkedin.com/company/marfatiastockbroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
          <a href="https://medium.com/@marfatiastockbroking" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Medium"><i class="bi bi-medium"></i></a>
          <a href="https://in.pinterest.com/Marfatiabroking/" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Pinterest"><i class="bi bi-pinterest"></i></a>
          <a href="https://www.marfatia.net" target="_blank" rel="noopener" class="footer-social-ico" aria-label="Website"><i class="bi bi-globe"></i></a>
        </div>'''

for fpath in glob.glob('*.html'):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    if '<div class="footer-social">' in content:
        content = re.sub(r'<div class="footer-social">[\s\S]*?</div>', new_social, content, count=1)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {fpath}')
