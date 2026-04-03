# Деплой Chocolandia.by (статический сайт)

Сайт — папка **`site/`**: чистый **HTML + CSS + JS**, без Node.js на хостинге.

## Перед загрузкой на хостинг

1. Установить зависимости (локально, один раз): `npm install`
2. Собрать стили: **`npm run build:css`** → создаётся `site/assets/main.css`
3. В **`site/index.html`** (и при необходимости в `catalog.html`, `cart.html`, …) замените в скрипте **`formspreeUrl`** на ваш URL Formspree: `https://formspree.io/f/xxxx`
4. Картинки товаров положите в **`site/NEW/`** (как в прежнем проекте путь `NEW/...`)

## Данные из Google Sheets

По умолчанию каталог и настройки главной подгружаются **в браузере** с опубликованных CSV (как в старом `google-sheets.ts`).

Если хостинг/браузер блокирует CORS к Google:

1. Локально: **`npm run fetch:data`** — скачивает CSV в **`site/data/products.csv`**
2. В `window.__CHOCOLANDIA_CONFIG__` добавьте: **`productsBundledUrl: "data/products.csv"`**

Опционально задайте свои URL листов: `productsCsvUrl`, `homeSettingsCsvUrl`, `homeCategoriesCsvUrl` (см. `site/assets/js/config.js`).

## Загрузка на хостинг

Залейте **содержимое `site/`** в корень сайта (например `public_html/`). Убедитесь, что открывается **`index.html`** по умолчанию.

В корне лежит **`.htaccess`** с короткими URL (`/catalog`, `/cart`, `/product/slug`) для **Apache**. Если у вас nginx или другой сервер — настройте эквивалент вручную.

## Чеклист

- [ ] `npm run build:css`
- [ ] Formspree URL в HTML
- [ ] Папка `NEW/` с изображениями
- [ ] При CORS-проблемах: `fetch:data` + `productsBundledUrl`

---

## EN (short)

Static site lives in **`site/`**. Run **`npm run build:css`** before deploy. Set **Formspree** URL in the inline **`__CHOCOLANDIA_CONFIG__`** script. Upload **`site/`** contents to the web root. Use **`.htaccess`** on Apache for clean URLs; optional **`npm run fetch:data`** + **`productsBundledUrl`** if Google CSV is CORS-blocked.
