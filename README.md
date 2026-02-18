# 📋 DRF Project Manager

Aplikacja do zarządzania projektami i zadaniami z wbudowanym czatem w czasie rzeczywistym oraz systemem powiadomień. Projekt oparty jest na **Django REST Framework** oraz **React**.

---

## ✨ Główne funkcje

- **Zarządzanie projektami** – tworzenie, edytowanie i usuwanie projektów.
- **Zarządzanie zadaniami** – przypisywanie zadań do projektów i użytkowników.
- **Komentarze** – dodawanie komentarzy do zadań.
- **Czat w czasie rzeczywistym** – komunikacja między użytkownikami oparta na WebSocketach (Django Channels + Redis).
- **Powiadomienia** – system powiadomień dla użytkowników.
- **Autoryzacja JWT** – bezpieczny dostęp do API z tokenami JWT (SimpleJWT).
- **Dokumentacja API** – automatycznie generowana dokumentacja OpenAPI (drf-spectacular).

---

## 🛠 Technologie

### Backend

| Technologia | Opis |
|---|---|
| Python 3.13 / Django 5.1 
| Django REST Framework
| Django Channels + Daphne 
| channels-redis 
| SimpleJWT 
| drf-spectacular 
| SQLite 

### Frontend

| Technologia | Opis |
|---|---|
| React 18 
| Vite 
| react-use-websocket 

---

## 🚀 Instalacja i uruchomienie

### Wymagania wstępne

- Python 3.13+
- Node.js 18+
- Redis (wymagany do działania czatu)

### 1) Backend (Django)

Wejdź do folderu backendu:

```bash
cd backend
```

Utwórz i aktywuj środowisko wirtualne:

```bash
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows
```

Zainstaluj zależności:

```bash
pip install -r requirements.txt
```

Utwórz plik `.env` na podstawie poniższego szablonu:

```env
SECRET_KEY=twoj_tajny_klucz_django
```

Wykonaj migracje bazy danych:

```bash
python manage.py migrate
```

Stwórz konto administratora:

```bash
python manage.py createsuperuser
```

Uruchom serwer deweloperski:

```bash
python manage.py runserver
```

> API dostępne pod adresem: `http://localhost:8000`  
> Dokumentacja Swagger: `http://localhost:8000/api/schema/swagger-ui/`

### 2) Frontend (React + Vite)

Wejdź do folderu frontend:

```bash
cd frontend
```

Zainstaluj zależności:

```bash
npm install
```

Utwórz plik `.env` i wypełnij zmienne środowiskowe:

```env
VITE_API_URL=http://localhost:8000
```

Uruchom aplikację:

```bash
npm run dev
```

> Aplikacja frontendowa dostępna pod adresem: `http://localhost:5173`
