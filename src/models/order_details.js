'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class order_details extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        order_details.hasMany(models.products, {foreignKey: 'product_id'});
        // order_details.hasOne(models.orders, {foreignKey: 'order_id'});

        }
    }
    order_details.init({
          product_id: DataTypes.STRING,
          order_id: DataTypes.STRING,
          quantity: DataTypes.INTEGER,
          price: DataTypes.INTEGER,
          total_price: DataTypes.INTEGER,
    }, {
        timestamps: false,
        sequelize,
        modelName: 'order_details',
    });
    return order_details;
};
