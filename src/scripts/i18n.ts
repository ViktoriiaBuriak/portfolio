import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import ua from '../i18n/ua.json'
import pl from '../i18n/pl.json'
import en from '../i18n/en.json'

i18n
  .use(LanguageDetector)
  .init({
    resources: {
      ua: { translation: ua },
      pl: { translation: pl },
      en: { translation: en }
    },
    fallbackLng: 'ua',
    interpolation: { escapeValue: false }
  })

/* ---------- HELPERS ---------- */

function normalizeLang(lang: string) {
  return lang.split('-')[0] // ua-UA -> ua
}

/* ---------- TRANSLATIONS ---------- */

function applyTranslations() {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n
    if (key) el.textContent = i18n.t(key)
  })
}

/* ---------- ACTIVE LANGUAGE ---------- */

function updateActiveLang(lang: string) {
  const normalized = normalizeLang(lang)

  document
    .querySelectorAll<HTMLButtonElement>('.lang button')
    .forEach(btn => {
      btn.classList.toggle(
        'active',
        btn.dataset.lang === normalized
      )
    })
}

i18n.on('languageChanged', (lng) => {
  applyTranslations()
  updateActiveLang(lng)
})

/* ---------- ACTIVE SECTION ---------- */

function initScrollSpy() {
  const navLinks =
    document.querySelectorAll<HTMLAnchorElement>('.nav a')

  const sections =
    document.querySelectorAll<HTMLElement>('section[id]')

  if (!navLinks.length || !sections.length) return

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.dataset.section === id
            )
          })
        }
      })
    },
    { threshold: 0.6 }
  )

  sections.forEach(section => observer.observe(section))
}

/* ---------- INIT ---------- */

window.addEventListener('DOMContentLoaded', () => {
  applyTranslations()
  updateActiveLang(i18n.language)

  // даємо DOM гарантовано відрендеритись
  setTimeout(initScrollSpy, 0)
})

/* ---------- EXPORT ---------- */
;(window as any).i18next = i18n
