import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath, pathToFileURL } from 'url';
import configFile from '../config/config.js';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const basename = path.basename(filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection successfull.');
    })
    .catch((err) => {
        console.error('Unable to connect database:', err);
    });

    const modelPromises = fs.readdirSync(dirname)
    .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1;
    })
    .map(async (file) => {
        const filePath = pathToFileURL(path.join(dirname, file)).href;
        const modelModule = await import(filePath);
        const model = modelModule.default(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

    Promise.all(modelPromises).then(() => {
        Object.keys(db).forEach((modelName) => {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });
        db.sequelize = sequelize;
        db.Sequelize = Sequelize;
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
