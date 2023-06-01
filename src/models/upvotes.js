'use strict';
const {
    Model
} = require('sequelize');
const {up} = require("../migrations/20230527141643-create-user");
module.exports = (sequelize, DataTypes) => {
    class upvotes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            upvotes.belongsTo(models.users, {foreignKey: 'user_id'});
            upvotes.belongsTo(models.businesses, {foreignKey: 'business_id'});
        }
    }
    upvotes.init({
        user_id: DataTypes.STRING,
        business_id: DataTypes.STRING,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        timestamps: false,
        sequelize,
        modelName: 'upvotes',
    });

    return upvotes;
};
