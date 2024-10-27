import { DataSource } from 'typeorm';
import { RoleSeed } from './role.seed';
import { AppDataSource } from '../config/data-source';
import { UserSeed } from './user.seed';
import { ParkingSeed } from './parking.seed';

async function runSeeds() {
  console.log('🌱 build default seeds...');
  const dataSource = new DataSource(AppDataSource.options);

  await dataSource.initialize();

  const roleSeed = new RoleSeed(dataSource);
  await roleSeed.run();

  const parkingSeed = new ParkingSeed(dataSource);
  await parkingSeed.run();

  const userSeed = new UserSeed(dataSource);
  await userSeed.run();

  await dataSource.destroy();
}

runSeeds()
  .then(() => {
    console.log('✅ seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ error seeding data:', error);
    process.exit(1);
  });
