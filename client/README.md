# Cinema App Lite - Клиентская часть

## Описание

Клиентская часть приложения для управления кинотеатром с системой аутентификации и авторизации.

## Функциональность

### 🔐 Система аутентификации

- **Регистрация** - создание нового аккаунта
- **Вход** - авторизация существующих пользователей
- **Автоматическое обновление токенов** - refresh token в куках, access token в localStorage
- **Защищенные маршруты** - автоматическое перенаправление неавторизованных пользователей
- **Профиль пользователя** - просмотр информации о текущем пользователе
- **Выход из системы** - безопасное завершение сессии

### 🎨 UI/UX

- Современный и адаптивный дизайн
- Анимации и переходы
- Система уведомлений (успех, ошибки, предупреждения)
- Загрузочные состояния
- Переключение между режимами входа и регистрации

## Технологии

- **React 19** - основная библиотека
- **React Router** - маршрутизация
- **Axios** - HTTP клиент с перехватчиками
- **CSS Modules** - стилизация компонентов
- **Context API** - управление состоянием аутентификации

## Структура проекта

```
src/
├── api/
│   ├── axios.js          # Настройка axios с перехватчиками
│   └── auth.js           # API функции для аутентификации
├── components/
│   ├── Navbar/           # Навигационная панель
│   ├── Footer/           # Подвал
│   ├── ProtectedRoute/   # Компонент защиты маршрутов
│   └── Notification/     # Система уведомлений
├── contexts/
│   └── AuthContext.jsx   # Контекст аутентификации
├── hooks/
│   ├── useAuth.js        # Хук для работы с аутентификацией
│   └── useNotification.js # Хук для уведомлений
├── pages/
│   ├── Auth/             # Страница входа/регистрации
│   ├── Profile/          # Страница профиля
│   ├── Movies/           # Страница фильмов
│   ├── Employees/        # Страница сотрудников
│   ├── Clients/          # Страница клиентов
│   └── Error/            # Страница ошибок
└── App.jsx               # Главный компонент приложения
```

## Установка и запуск

1. Установите зависимости:

```bash
npm install
```

2. Запустите сервер разработки:

```bash
npm run dev
```

3. Откройте браузер и перейдите по адресу `http://localhost:5173`

## API Endpoints

Приложение настроено для работы с бэкендом на `http://localhost:3000`:

- `POST /register` - регистрация пользователя
- `POST /login` - вход в систему
- `POST /refresh` - обновление access token
- `POST /logout` - выход из системы (опционально)

## Особенности реализации

### Автоматическое обновление токенов

- При получении 401 ошибки автоматически пытается обновить access token
- Refresh token хранится в куках (httpOnly)
- Access token хранится в localStorage

### Защищенные маршруты

- Все основные страницы защищены компонентом `ProtectedRoute`
- Неавторизованные пользователи автоматически перенаправляются на `/auth`
- Отображение загрузочного состояния при проверке токенов

### Система уведомлений

- Toast-уведомления в правом верхнем углу
- Автоматическое исчезновение через 5 секунд
- Возможность закрыть вручную
- Разные типы: success, error, warning, info

### Адаптивность

- Полностью адаптивный дизайн
- Оптимизация для мобильных устройств
- Современные CSS Grid и Flexbox

## Безопасность

- Токены автоматически обновляются
- Безопасное хранение в httpOnly куках
- Автоматическая очистка при выходе
- Защита от XSS через правильную обработку данных

## Дальнейшее развитие

- Добавление ролей пользователей
- Редактирование профиля
- Восстановление пароля
- Двухфакторная аутентификация
- Интеграция с социальными сетями
