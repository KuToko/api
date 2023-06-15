'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class products extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            products.belongsTo(models.order_details, {
                foreignKey: 'product_id'
            });
        }
    }
    products.init({
        business_id: DataTypes.STRING,
        name: DataTypes.STRING,
        price: DataTypes.INTEGER,
        description: DataTypes.STRING,
        product_image: DataTypes.STRING,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        timestamps: false,
        sequelize,
        modelName: 'products',
    });
    return products;
};
