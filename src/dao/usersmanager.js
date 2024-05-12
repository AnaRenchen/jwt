import { usersModel } from "./models/usersModel.js";

export class usersManagerMongo {
  async create(user) {
    let newUser = usersModel.create(user);
    return await newUser;
  }

  async getBy(filter = {}) {
    return await usersModel.findOne(filter).lean();
  }
}
