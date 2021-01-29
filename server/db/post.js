const { Model, DataTypes } = require('sequelize');

class Post extends Model {}

async function init(sequelize, user) {
  Post.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    userId: {
      allowNull: false,
      references: {
        model: user,
        key: "id"
      },
      type: DataTypes.STRING,
    },
    text: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    date :{
      allowNull: false,
      type: DataTypes.DATE,
    },
    pictures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: false,
      alter: true,
    }
  }, { 
    sequelize, 
    modelName: "post",
    schema: "application",
    freezeTableName: true,
    timestamps: false
  });

  user.hasMany(Post);
  Post.belongsTo(user);
  await Post.sync();

  return {
    async create(postData) {
      const post = await Post.create(postData);
      return post;
    },
    async findNext({ limit = 7, offset = 0 }) {
      const posts = await Post.findAll({ 
        include: "user",
        limit,
        offset
      });
      return posts.map(p => p.toJSON());
    },
    async findById(id) {
      const post = await Post.findOne({ 
        where: { id }, 
        json: true,
        include: "user",
      });
      return post;
    },
    async delete(id) {
      const count = await Post.destroy({ 
        where: { id }
      });
      return count === 1;
    },

    async update(post) {
      const [_result, posts] = await Post.update(post, { 
        where: { id: post.id }, 
        returning: true,
      });
      return posts[0].toJSON();
    },
  }
}

module.exports = {
  init,
  Post,
}