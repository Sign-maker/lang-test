import { mainPageLangData } from './data';

const htmlEl = document.querySelector('html');
const langElems = document.querySelectorAll('[data-lang]');
const backdropEl = document.querySelector('.backdrop');
const langSelEl = document.querySelector('#lang-select');

const langData = mainPageLangData;

class Language {
  static USER_LANG = 'userLang';
  #defaultLang = 'en';
  #currentLang = '';
  #languagesList = ['en', 'ru', 'pl'];
  constructor() {}

  getLangOnLoad() {
    return (this.#currentLang =
      this.readLangFromLocalStorage() ||
      this.getBrowserLang() ||
      this.#defaultLang);
  }
  getBrowserLang() {
    const lang = window.navigator.language.split('-')[0];
    return this.langIsInList(lang) ? lang : false;
  }

  langIsInList(lang) {
    return this.#languagesList.some(alLang => alLang === lang);
  }

  set language(lang) {
    this.#currentLang = lang;
  }

  get language() {
    return this.#currentLang;
  }

  readLangFromLocalStorage() {
    try {
      const lang = JSON.parse(localStorage.getItem(Language.USER_LANG));
      return this.langIsInList(lang) ? lang : false;
    } catch {
      return false;
    }
  }

  writeLangToLocalStorage(lang) {
    localStorage.setItem(Language.USER_LANG, JSON.stringify(lang));
  }
}

langSelEl.addEventListener('change', onSelChange);

const langObj = new Language();

initOnLoad();

function initOnLoad() {
  langObj.getLangOnLoad();
  langObj.writeLangToLocalStorage(langObj.language);
  setSelectedInSelect(langObj.language);
  applyLangToMarkup(langObj.language);
}

function setSelectedInSelect(lang) {
  langSelEl.value = lang;
}

function onSelChange(evt) {
  const lang = evt.target.value;

  applyLangToMarkup(lang);
  langObj.writeLangToLocalStorage(lang);
}

function applyLangToMarkup(lang) {
  langElems.forEach(langEl => {
    if (langData[langEl.dataset.lang][lang]) {
      langEl.textContent = langData[langEl.dataset.lang][lang];
    }
  });

  htmlEl.setAttribute('lang', lang);
  backdropEl.classList.add('is-hidden');
}
