'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class tokens extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    tokens.init({
        name: DataTypes.STRING,
        logo: DataTypes.STRING,
        key: DataTypes.STRING,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        timestamps: false,
        sequelize,
        modelName: 'tokens',
    });
    return tokens;
};
