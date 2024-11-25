

export default (sequelize, DataTypes) => {
    const post = sequelize.define(
        'post',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
        },
        {
            tableName: 'post',
            timestamps: true,
        },
    );

    post.associate = function (models) {
        post.belongsTo(models.user, {
            foreignKey: 'userId', 
            as: 'user', 
        });
        
        post.belongsToMany(models.user, {
            through: models.user_post,
            as: 'usersShared',
            foreignKey: 'postId',
        });
    };

    return post;
};