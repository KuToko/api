'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class orders extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // orders.belongsTo(models.users, {foreignKey: 'user_id'});
            // orders.belongsTo(models.businesses, {foreignKey: 'business_id'});
            orders.belongsTo(models.payments, {foreignKey: 'payment_id'});

            orders.hasMany(models.order_details, {foreignKey: 'order_id'});
        }
    }
    orders.init({
        business_id: DataTypes.STRING,
        user_id: DataTypes.STRING,
        payment_id: DataTypes.STRING,
        status: DataTypes.STRING,
        total_price: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        timestamps: false,
        sequelize,
        modelName: 'orders',
    });
    return orders;
};
