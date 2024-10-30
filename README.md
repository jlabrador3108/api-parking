# Api parking

## Descripción

- API RESTful utilizando Nestjs para la gestión de un parking.


## Tecnologías utilizadas

- Nestjs
- TypeOrm
- PostgreSql
- MongoDB


## Instalación and configuración

1. **Clonar el repositorio**

   ```bash
   git clone <REPOSITORY_URL>
   cd <PROJECT_NAME>

   ```
2. **Instalar las dependencias**

   ```bash
   npm install

   ```
3. **.env.example**

- Puede usar el archivo .env.example para crear el .env

4. **Generar las migraciones**

   ```bash
   npm run typeorm:migration:generate

   ```
5. **Correr las migraciones**

   ```bash
   npm run typeorm:migration:run

   ```
6. **Correr las inserciones en la base de datos**

   ```bash
   npm run seed

   ```
7. **Iniciar el servidor**

   ```bash
   yarn start:dev

   ```
8. **Test e2e**

   ```bash
   npm run test:e2e

   ```
9. **Test en Postman**

- Puede importar en post el archivo `api-parking.postman_collection` localizado en la raíz del proyecto

10. **Documentación**

- en /api


### usuarios insertados en las inserciones a la base de datos en la paso 6

const users = [
{
email: 'cliente@parking.com',
password: '1234',
},
{
email: 'empleado@parking.com',
password: '1234',
},
{
email: 'admin@parking.com',
password: '1234',
},
];


### Casos de uso

1. Reservar una plaza de aparcamiento: un cliente desea reservar una plaza de aparcamiento
   para un vehículo en particular. El cliente hace una solicitud POST a la API con los detalles del
   vehículo y la fecha y hora de la reserva. La API verifica que haya una plaza de aparcamiento
   disponible en la fecha y hora especificadas y reserva la plaza de aparcamiento para el
   vehículo del cliente. La API devuelve una respuesta con los detalles de la reserva.

2. Consultar la ocupación del parking: un empleado desea conocer la ocupación actual del
   parking. El empleado hace una solicitud GET a la API para obtener información sobre la
   ocupación actual del parking. La API consulta la base de datos para obtener información
   actualizada sobre las plazas de aparcamiento ocupadas y devuelve una respuesta al
   empleado con los detalles de la ocupación del parking.

3. Actualizar los detalles de un usuario: un administrador desea actualizar los detalles de un
   usuario en particular, como su nombre, dirección de correo electrónico o número de
   teléfono. El administrador hace una solicitud PUT a la API con los detalles actualizados del
   usuario. La API verifica que el usuario tenga los permisos adecuados para realizar la
   actualización y actualiza los detalles del usuario en la base de datos. La API devuelve una
   respuesta con los detalles actualizados del usuario.

4. Acceder a los logs del parking: un administrador desea acceder a los logs de actividad del
   parking para conocer el historial de reservas, cancelaciones, entradas y salidas de vehículos,
   etc. El administrador hace una solicitud GET a la API para obtener los registros de actividad
   del parking. La API verifica que el usuario tenga los permisos adecuados para acceder a los
   registros y devuelve una respuesta con los registros de actividad del parking.
