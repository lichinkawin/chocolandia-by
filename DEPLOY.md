# Деплой Chocolandia.by

## Важно

На сервере должен быть **тот же репозиторий**, что и локально: **Next 16**, **React 19**, **Tailwind v4**.  
Старый `package.json` с Next 15 + Tailwind 3 **нельзя** смешивать с текущим кодом — замените файлы целиком (`git pull` / заново склонируйте проект).

## Требования

- **Node.js ≥ 20.9** (см. `package.json` → `engines`, файл `.nvmrc`).
- Установка зависимостей из **lock-файла**: `npm ci` (предпочтительно) или `npm install`.

## Сборка на хостинге

Если `npm run build` падает с **Turbopack** / `next-panic-*.log`, используйте сборку через **webpack**:

```bash
npm ci
npm run build:webpack
npm run start
```

Локально по умолчанию остаётся `npm run build` (часто быстрее). На «капризных» VPS/шаред-хостингах надёжнее **`build:webpack`**.

## PostCSS

Используется только `postcss.config.mjs` с плагином `@tailwindcss/postcss`.  
Не добавляйте в конфиг поля вроде `__esModule` — Next на это ругается.

## Чеклист после `git pull` на сервере

1. `node -v` → не ниже 20.9  
2. Удалить старые модули: `rm -rf node_modules`  
3. `npm ci`  
4. `npm run build:webpack`  
5. `npm run start` (или настройте PM2/systemd на `next start`)

## cPanel (Git → Deploy)

В корне репозитория лежит **`.cpanel.yml`**: при деплое выполняются `npm install` и `npm run build:webpack` в каталоге репозитория.

1. **Закоммитьте и запушьте** в `main`: `.cpanel.yml`, `package.json`, **`package-lock.json`**, весь код.  
2. Если путь к репозиторию **не** `$HOME/repositories/chocolandia-by` (у вас было `/hosting2/chocolan/repositories/chocolandia-by`), откройте `.cpanel.yml` и замените `DEPLOYPATH` на **абсолютный путь** к папке клона на сервере, например:  
   `export DEPLOYPATH=/hosting2/chocolan/repositories/chocolandia-by`  
3. В cPanel: **Setup Node.js Application** — корень приложения = тот же каталог, что `DEPLOYPATH`, команда запуска **`npm run start`**, версия Node **20+**.  
4. Условие панели «нет непереданных изменений»: сделайте **`git push`** с ПК, затем в cPanel обновите/задеплойте ветку `main`.

---

## EN (short)

Deploy the **same** repo state as development (Next 16, Tailwind 4). Use **Node ≥ 20.9**. If production build crashes with Turbopack, run **`npm run build:webpack`** then **`npm run start`**.
