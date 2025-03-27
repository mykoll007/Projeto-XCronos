const knex = require('./src/database/connection'); // Verifique se esse é o caminho correto do seu arquivo de conexão

knex.raw('SELECT 1+1 AS resultado')
  .then(() => {
    console.log("✅ Conexão com o banco de dados bem-sucedida!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao banco:", err);
    process.exit(1);
  });
