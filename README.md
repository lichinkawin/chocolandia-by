# Chocolandia.by

Статический витринный сайт: папка **`site/`** (HTML, ES-модули, Tailwind CSS).

## Разработка

```bash
npm install
npm run build:css   # site/assets/main.css
```

Откройте **`site/index.html`** через локальный сервер (иначе ES-модули могут блокироваться), например:

```bash
npx serve site
```

## Деплой

См. **[DEPLOY.md](./DEPLOY.md)**. Кратко: собрать CSS, настроить Formspree в `__CHOCOLANDIA_CONFIG__`, залить содержимое **`site/`** на хостинг.

## Данные

Каталог подгружается с Google Sheets (CSV). При CORS-ошибках: `npm run fetch:data` и `productsBundledUrl` в конфиге.
