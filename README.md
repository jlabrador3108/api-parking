npm run typeorm -- migration:generate -d src/database/config/data-source.ts src/database/migrations/init

npm run typeorm:migration:run -- -d src/database/config/data-source.ts

typeorm cache:clear

npm run

# mongo

npm run typeorm -- migration:generate -d src/database/config/data-source-mongo.ts src/database/migrations/mongo/init

npm run typeorm:migration:run -- -d src/database/config/data-source-mongo.ts

const users = [
{
email: 'cliente@parking.com', //idRole 3
password: '1234',
},
{
email: 'empleado@parking.com', //idRole 2
password: '1234',
},
{
email: 'admin@parking.com', //idRole
password: '1234',
},
];
