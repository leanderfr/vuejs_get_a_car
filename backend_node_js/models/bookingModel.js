

module.exports = (sequelize, DataTypes) => {

  const Booking = sequelize.define("Booking", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    pickup_datetime: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: DataTypes.NULL,
    },
    car_id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: DataTypes.NULL,
    },
    dropoff_datetime: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: DataTypes.NULL,
    },
    driver_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: DataTypes.NULL,
    },

  },
  {
    tableName: 'booking',
    timestamps: true,
    paranoid: true,     // soft delete 
    underscored: true,
  })

  Booking.associate = function (model) {
      Booking.belongsTo(model.Car, {
          as: 'Car',
          foreignKey: 'car_id'
      });
  }

  //Booking.belongsTo(Car, { foreigkey: 'car_id', allowNull: false } )  

  return Booking


}

