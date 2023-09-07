const UserCreateService = require("./UserCreateService")
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory")
const AppError = require("../utils/AppError")

describe ("UserCreateService", () => {

  let userRepositoryInMemory = null
  let userCreateService = null
  
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    userCreateService = new UserCreateService(userRepositoryInMemory)
  })


  it("user should be create", async ()  => {
    const user = {
      name: "user_test",
      email: "user@teste.com",
      password: "1"
    }
    const userCreated = await userCreateService.execute(user)
    expect(userCreated).toHaveProperty("id");
  })

  it("user should not be created with an email already registred", async() =>{
    const user1 = {
      name: "User test 1",
      email: "user@test.com",
      password: "1"
    }

    const user2 ={
      name: "User test 2",
      email: "user@test.com",
      password: "1"
    }

    await userCreateService.execute(user1);

    await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError("Este e-mail já está cadastrado."))

  })

});