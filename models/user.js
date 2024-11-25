
export default (sequelize, DataTypes) => {    
    const user = sequelize.define(
        'user',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'user',
            timestamps: true,
        },
    );

    user.associate = function (models) {
        user.hasMany(models.post, {
            foreignKey: 'userId', 
            as: 'post',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        user.belongsToMany(models.post, {
            through: models.user_post,
            as: 'sharedPosts',
            foreignKey: 'userId',
        });
    };

    return user;
};