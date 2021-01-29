const { Model, DataTypes } = require('sequelize');

class User extends Model {}

async function init(sequelize) {
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName :{
      allowNull: false,
      type: DataTypes.STRING,
    },
    profilePicture: DataTypes.STRING,
    birthday: DataTypes.DATE
  }, { 
    sequelize, 
    modelName: "user",
    schema: "application",
    freezeTableName: true,
    timestamps: false
  });

  await User.sync();

  return {
    /**
     * 
     * @param {User} userData 
     */
    async create(userData) {
      const user = await User.create(userData);
      return user.toJSON();
    },
    /**
     * 
     * @param {string} id 
     */
    async findById(id){
      const user = await User.findOne({ where: { id } });
      return user;
    },

    async update(userData, fields) {
      const [_result, users] = await User.update(userData, { 
        where: { id: userData.id }, 
        returning: true,
        fields
      });
      return users[0].toJSON();
    },
    async delete(id) {
      const rowsDelete = await User.destroy({ 
        where: { id }
      })
      return rowsDelete === 1;
    },
  }
}

module.exports = {
  init,
  User
}
