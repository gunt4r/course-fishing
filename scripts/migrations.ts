import { getDataSource } from '@/libs/DB';

async function runMigrations() {
  try {
    console.log('🚀 Running database migrations...');
    const dataSource = await getDataSource();

    if (process.env.NODE_ENV === 'production') {
      await dataSource.runMigrations();
      console.log('✅ Migrations completed successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split('\n')[0] : null,
    });
    process.exit(1);
  }
}

runMigrations();
