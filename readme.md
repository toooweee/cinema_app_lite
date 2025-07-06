# Cinema App Lite

Полнофункциональное приложение для управления кинотеатром с использованием NestJS (backend) и React (frontend). Это приложение, которые я написал для сдачи учебной практики в колледже, на написание от и до, ушло 2 дня, некоторые изменения не закомичены были, со своего ноута показывал проект. Докер композ в папке api использовался для разработки, поднятия бд. Этой версии (lite) приложения не должно было быть вообще, я хотел сделать первую версию с традиционным REST API по всем best-practise, и, конечно, отточить навыки клиенткой разработки. По итогу в API мы имеем чистый относительно код, модульную архитектура, но логики почти нет, одни круды. Клиент же прикольный такой вышел. Я планирую продолжать серию `cinema_app`, в каждой версии из которых подход к коду кардинально отличался бы. Спасибо за прочтение.

## 🚀 Быстрый старт с Docker

### Предварительные требования

- Docker
- Docker Compose

### Запуск приложения

#### Вариант 1: Используя npm скрипты (рекомендуется)

```bash
# Запуск всех сервисов
npm start

# Остановка
npm run stop
```

### Доступные сервисы

После успешного запуска будут доступны:

| Сервис        | URL                            | Описание             |
| ------------- | ------------------------------ | -------------------- |
| Frontend      | http://localhost:5173          | React приложение     |
| Backend API   | http://localhost:3000          | NestJS API           |
| API Docs      | http://localhost:3000/api/docs | Swagger документация |
| PostgreSQL    | localhost:5430                 | База данных          |

### Учетные данные по умолчанию

После первого запуска автоматически создается администратор:

- **Email:** admin@example.com
- **Password:** string

## Полезные команды

### Основные команды

```bash
npm start              # Запуск всех сервисов
npm run stop           # Остановка всех сервисов
npm run dev            # Запуск в режиме разработки
npm run build          # Пересборка контейнеров
npm run logs           # Просмотр всех логов
npm run status         # Статус сервисов
```

### Логи конкретных сервисов

```bash
npm run docker:logs:api     # Логи API
npm run docker:logs:client  # Логи клиента
npm run docker:logs:db      # Логи базы данных
```

### Prisma Studio

```bash
npm run studio              # Запуск Prisma Studio
```

### Shell в контейнерах

```bash
npm run docker:shell:api    # Shell в API контейнере
npm run docker:shell:client # Shell в клиентском контейнере
npm run docker:shell:db     # Подключение к базе данных
```

### Управление

```bash
npm run docker:restart      # Перезапуск всех сервисов
npm run docker:clean        # Полная очистка (удаление volumes)
```

## 🔧 Технологии

### Backend

- **NestJS** - фреймворк для Node.js
- **Prisma** - ORM для работы с базой данных
- **PostgreSQL** - основная база данных
- **JWT** - аутентификация
- **Swagger** - API документация

### Frontend

- **React** - UI библиотека
- **Vite** - сборщик
- **React Router** - маршрутизация
- **Axios** - HTTP клиент

## 📝 Функциональность

- Аутентификация и авторизация
- Управление пользователями и ролями
- Управление фильмами и жанрами
- Управление сотрудниками
- Управление клиентами
- Система отзывов
- Загрузка файлов (аватары, изображения фильмов)

## 🔧 Настройка окружения

### Переменные окружения

Создайте файл `.env` в корне проекта на основе `env.example`:

```bash
cp .env.example .env
```

Основные переменные:

- `DATABASE_URL` - URL подключения к PostgreSQL
- `JWT_SECRET` - Секретный ключ для JWT токенов
- `JWT_REFRESH_SECRET` - Секретный ключ для refresh токенов
- `PORT` - Порт для API сервера

## 🔄 Обновление приложения

```bash
# Остановка сервисов
npm run stop

# Получение обновлений
git pull

# Пересборка и запуск
npm run start
```

## 📊 Мониторинг

### Логи

```bash
# Все логи
npm run logs

# Логи с временными метками
docker-compose logs -f --timestamps
```

### Health checks

```bash
# Проверка API
curl -f http://localhost:3000/api/health

# Проверка базы данных
docker-compose exec postgres pg_isready -U postgres
```

## 🐛 Отладка

### Просмотр логов

```bash
# Все сервисы
npm run logs

# Конкретный сервис
npm run docker:logs:api
npm run docker:logs:client
npm run docker:logs:db
```

### Доступ к базе данных

```bash
# Через Prisma Studio
npm run studio

# Прямое подключение
npm run docker:shell:db
```

### Перезапуск сервиса

```bash
npm run docker:restart
```

### Shell в контейнерах

```bash
# API контейнер
npm run docker:shell:api

# Client контейнер
npm run docker:shell:client
```
