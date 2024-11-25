export default (sequelize, DataTypes) => {
  const user_post = sequelize.define(
      'user_post',
      {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
          userId: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                  model: 'user',
                  key: 'id',
              },
          },
          postId: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                  model: 'post',
                  key: 'id',
              },
          },
      },
      {
          tableName: 'user_post',
          timestamps: true,
      }
  );

  return user_post;
};
