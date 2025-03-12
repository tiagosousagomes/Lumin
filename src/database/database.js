const mongoose = require("mongoose");

class Database {
  constructor(connectionString) {
    //connectionString guarda a string de conexão com o atlas
    if (!connectionString) {
      //verifica se conectou, se não conectar ele mostra o erro "connection is a required"
      throw new error("Connection is a required!");
    }
    this.connectionString = connectionString;
    this.connection = null; //inicia com null que é pra guardar a conexão com o BD
  }

  async connect() {
    try {
      await mongoose.connect(this.connectionString, {
        //mongoose.connect é conectar com o Mongo
        useNewUrlParser: true, //evita aviso de depreciação
        useUnifiedTopology: true,
      });
      console.log("Database Connect!"); //esses this.connection.on são pra monitorar o estado da conexão
      this.connection = mongoose.connection;

      this.connection.on("connected", () => {
        console.log("Mongoose connected to DB");
      });

      this.connection.on("disconnect", () => {
        console.log("Mongoose disconnect from DB");
      });

      this.connection.on("error", () => {
        console.log("Mongoose connection error:", err.message);
      });
    } catch (err) {
      console.log("Database connection error:", err.message);
      throw err; // Lança o erro para ser tratado externamente
    }
  }

  async disconnect() {
    //basicamente voce sair do banco de dados, e ele verificar se voce desconectou
    if (this.connection) {
      await this.connection.close();
      console.log("Mongoose disconnected from DB");
    }
  }

  getConnection() {
    //vai pegar e ver se ja tem uma conexão no banco de dados, se tiver ai lança erro
    if (!this.connection) {
      throw new error("No active connection BD");
    }
    return this.connection;
  }
}

// Faz com que só uma instancia do banco de dados seja criada
let instance = null;

module.exports = (connectionString) => {
  if (!instance) {
    instance = new Database(connectionString);
  }
  return instance;
};
