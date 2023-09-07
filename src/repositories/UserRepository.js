const sqliteConnetion = require("../database/sqlite")

class UserRepository {

  async findByEmail(email) {
    const database = await sqliteConnetion();
    const user = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    return user;
  }

  async create ({name, email, password}){
    const database = await sqliteConnetion();

    const userId = await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]
    )
    return {id: userId}
  }
}

module.exports = UserRepository