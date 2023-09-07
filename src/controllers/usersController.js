/** um Controller deve ter no máximo 5 métodos

* index - GET para listar vários registros
* show  - GET para exibir um registro específico
* create - POST para criar um registro
* update - PUT para Atualizar um registro
* delete - DELETE para remover um registro

*/
const {hash, compare} = require ("bcryptjs")
const AppError = require("../utils/AppError");
const sqliteConnetion = require("../database/sqlite")
const UserRepository = require("../repositories/UserRepository")
const UserCreateService = require("../services/UserCreateService")

class UsersController{

  async create (request, response){
    const {name, email, password} = request.body;

    const userRepository = new UserRepository();
    const userCreateService = new UserCreateService(userRepository);

    await userCreateService.execute({name, email, password}) 


    return response.status(201).json();

  }

  async update (request, response){
    const {name, email, password, old_password} = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnetion();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if(!user){
      throw new AppError("Usuário não encontrado.")
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppError ("Este e-mail já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !old_password){
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
    }

    if(password && old_password){
      const checkOldPassword = await compare (old_password, user.password);

      if(!checkOldPassword){
        throw new AppError("A Senha antiga não confere.")
      }

      user.password= await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password,  user_id ]
      );

      return response.json()
  }


}

module.exports = UsersController;

// if(!name){
//   throw new AppError("Colocar nome");
// }

// response.status(201).json({name, email, password});