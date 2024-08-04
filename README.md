# sistema-bancario-social-final
Este proyecto es una continuación de la actividad anterior, implementando un backend para un Sistema Bancario Social con almacenamiento persistente, operaciones CRUD, autenticación y manejo de roles.

## Características
- Gestión de usuarios, préstamos, cuentas de ahorro, cooperativas y cooperativas.
- Operaciones CRUD completas para todas las entidades.
- Almacenamiento persistente utilizando MySQL.
- Interfaz de usuario para la gestión de usuarios, cuentas de ahorro, préstamos y cooperativas.
- Endpoints para todas las operaciones.
- Uso de clases y promesas para una mejor estructura y manejo asíncrono.
- Uso de JWT y bcrypt para la auntenticación.
- Uso de un script de migración para desplegar la base de datos.

## Tecnologías utilizadas
- Node.js
- Express.js
- MySQL
- EJS (para las vistas)
- HTML y CSS
- JWT y bcrypt
- Sequelize

## Instalación
- **1.** Clona el repositorio:
```
git clone https://github.com/teranricardo/sistema-bancario-social-final.git
```
- **2.**  Ingresa al directorio del proyecto:
```
cd sistema-bancario-social-final
```
- **3.**  Instala las dependencias:
```
npm install
```
- **4.** Configura las variables de entorno en un archivo `.env`. Puedes basarte en el archivo `.env.example` proporcionado.

- **5.** Ejecuta el script de migración para desplegar la base de datos:
```
npm run create-db
```

## Uso
- **1.** Ejecuta la aplicación: 
```
npm start
```
- **2.**  El servidor estará escuchando en el puerto `3000`.
