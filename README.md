# 📅 ReservaSpace — Sistema de Gestión de Reservas

Aplicación web completa para gestionar y visualizar reservas de espacios. Diseñada para desplegarse en **GitHub Pages** con sincronización en tiempo real mediante **Firebase Firestore**.

![Vista del calendario](https://via.placeholder.com/800x400/6366f1/ffffff?text=ReservaSpace+—+Calendario)

## ✨ Características

- **Calendario profesional** con vistas mensual, semanal, diaria y lista (FullCalendar)
- **Tiempo real** — los cambios del administrador se reflejan en todos los usuarios conectados sin recargar
- **Dos roles**: Administrador (CRUD completo) y Visitante (solo lectura, sin login)
- **Modo claro / oscuro** con detección automática de preferencias del sistema
- **Responsive** — funciona en computadores, tablets y celulares
- **Filtros** por espacio, estado y búsqueda de texto
- **Drag & drop** de reservas en el calendario (solo administradores)
- **5 espacios preconfigurados** con datos de ejemplo

---

## 🏗️ Estructura del proyecto

```
reservas-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD para GitHub Pages
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── LoginForm.jsx   # Formulario de login admin
│   │   ├── Calendar/
│   │   │   └── CalendarView.jsx # Vista de calendario (FullCalendar)
│   │   ├── Layout/
│   │   │   └── Sidebar.jsx     # Navegación lateral
│   │   ├── Reservations/
│   │   │   ├── ReservationDetail.jsx  # Modal de detalle
│   │   │   ├── ReservationForm.jsx    # Modal de crear/editar
│   │   │   └── ReservationsList.jsx   # Vista de lista
│   │   └── Spaces/
│   │       └── SpacesManager.jsx      # Gestión de espacios
│   ├── contexts/
│   │   ├── AuthContext.jsx     # Estado global de autenticación
│   │   └── ThemeContext.jsx    # Estado global de tema
│   ├── hooks/
│   │   ├── useReservations.js  # CRUD + suscripción en tiempo real
│   │   └── useSpaces.js        # CRUD + suscripción en tiempo real
│   ├── services/
│   │   ├── auth.js             # Firebase Authentication
│   │   ├── firebase.js         # Inicialización de Firebase
│   │   └── firestore.js        # Operaciones CRUD Firestore
│   ├── styles/
│   │   └── global.css          # Variables de diseño + estilos base
│   ├── utils/
│   │   └── helpers.js          # Funciones utilitarias y constantes
│   ├── App.jsx                 # Componente raíz con enrutamiento
│   └── main.jsx                # Punto de entrada React
├── .env.example                # Plantilla de variables de entorno
├── .gitignore
├── firestore.rules             # Reglas de seguridad Firestore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## 🚀 Guía de despliegue paso a paso

### Paso 1: Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en **"Agregar proyecto"**
3. Ingresa el nombre (ej: `reservas-app`) → Continuar
4. Deshabilita Google Analytics (opcional) → Crear proyecto

### Paso 2: Habilitar Firebase Authentication

1. En el menú izquierdo, ve a **Authentication** → **Get started**
2. En la pestaña **Sign-in method**, habilita **Correo electrónico/contraseña**
3. Guarda los cambios

### Paso 3: Crear el usuario administrador

1. En **Authentication** → pestaña **Users** → **Add user**
2. Ingresa el correo y contraseña del administrador
3. Haz clic en **Add user** y guarda el `UID` (lo necesitarás para las reglas)

> ⚠️ **Seguridad**: El email y contraseña que ingreses aquí son las credenciales de inicio de sesión del administrador en la app.

### Paso 4: Crear la base de datos Firestore

1. Ve a **Firestore Database** → **Create database**
2. Selecciona **Production mode** (empezar en modo producción)
3. Elige la región más cercana (ej: `us-east1` para Colombia)
4. Haz clic en **Enable**

### Paso 5: Aplicar reglas de seguridad

1. En Firestore → pestaña **Rules**
2. Reemplaza todo el contenido con el contenido del archivo `firestore.rules`
3. Haz clic en **Publish**

### Paso 6: Obtener credenciales de Firebase

1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. Baja hasta **"Tus apps"** → **"</> Web"**
3. Registra la app (nombre: `reservas-web`)
4. Copia el objeto `firebaseConfig`

### Paso 7: Crear el repositorio en GitHub

```bash
# En tu computador local
git init
git add .
git commit -m "feat: initial commit — ReservaSpace"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/reservas-app.git
git push -u origin main
```

> 💡 Asegúrate de que el nombre del repositorio sea **`reservas-app`** (o ajusta `vite.config.js` → `base`)

### Paso 8: Configurar GitHub Secrets

1. En tu repositorio de GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Crea estos secretos con los valores de Firebase:

| Secret | Valor |
|--------|-------|
| `VITE_FIREBASE_API_KEY` | Tu `apiKey` de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Tu `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | Tu `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Tu `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Tu `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | Tu `appId` |

### Paso 9: Habilitar GitHub Pages

1. En tu repositorio → **Settings** → **Pages**
2. En **Source**, selecciona **GitHub Actions**
3. Guarda

### Paso 10: Primer despliegue

El workflow se ejecutará automáticamente al hacer push a `main`. Puedes verificarlo en la pestaña **Actions** de GitHub.

Una vez completado, tu app estará en:
```
https://TU_USUARIO.github.io/reservas-app/
```

---

## 💻 Desarrollo local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/reservas-app.git
cd reservas-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Firebase

# 4. Iniciar servidor de desarrollo
npm run dev
# Abre http://localhost:5173
```

---

## 🔐 Credenciales de acceso

- **Visitante**: Solo accede a la URL de la app, no necesita login
- **Administrador**: Usa el email y contraseña creados en Firebase Authentication

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18 | Framework de UI |
| Vite | 5 | Build tool y dev server |
| Firebase Auth | 10 | Autenticación del administrador |
| Firebase Firestore | 10 | Base de datos en tiempo real |
| FullCalendar | 6 | Componente de calendario |
| date-fns | 3 | Manejo de fechas |
| Lucide React | 0.344 | Íconos |
| react-hot-toast | 2 | Notificaciones |

---

## 📝 Personalización

### Cambiar el nombre de los espacios

Los espacios se crean automáticamente la primera vez que la app se conecta a Firestore. Para modificarlos:
1. Inicia sesión como administrador
2. Ve a **Espacios** en el menú lateral
3. Edita o elimina los espacios existentes / crea nuevos

### Cambiar el nombre del repositorio (base URL)

Edita `vite.config.js`:
```js
base: '/NOMBRE_DE_TU_REPOSITORIO/',
```

### Agregar más administradores

En Firebase Console → Authentication → Users → Add user

---

## 🐛 Solución de problemas

**La app muestra pantalla en blanco después del despliegue**
- Verifica que `base` en `vite.config.js` coincida exactamente con el nombre de tu repositorio
- Revisa los logs del workflow en GitHub Actions

**Error "Firebase: No Firebase App named '[DEFAULT]'"**
- Verifica que los GitHub Secrets estén correctamente configurados
- Asegúrate de que todos los valores de `VITE_FIREBASE_*` estén presentes

**Las reservas no se sincronizan en tiempo real**
- Verifica las reglas de Firestore (deben estar publicadas)
- Revisa la consola del navegador para errores de permisos

**No puedo iniciar sesión como administrador**
- Verifica que el usuario exista en Firebase Authentication → Users
- Asegúrate de que la cuenta no esté deshabilitada

---

## 📄 Licencia

MIT © 2026 — Desarrollado con ❤️ usando React + Firebase
#   R E S E R V A S - A P P  
 