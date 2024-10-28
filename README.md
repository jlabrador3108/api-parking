npm run typeorm -- migration:generate -d src/database/config/data-source.ts src/database/migrations/init

npm run typeorm:migration:run -- -d src/database/config/data-source.ts

typeorm cache:clear

npm run seed

# mongo

npm run typeorm -- migration:generate -d src/database/config/data-source-mongo.ts src/database/migrations/mongo/init

npm run typeorm:migration:run -- -d src/database/config/data-source-mongo.ts

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
