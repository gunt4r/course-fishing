export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getDataSource } = await import('./src/libs/DB');
    
    try {
      console.log('🚀 Initializing database on server startup...');
      await getDataSource();
      console.log('✅ Database ready!');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
    }
  }
}