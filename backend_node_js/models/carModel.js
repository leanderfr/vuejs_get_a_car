

module.exports = (sequelize, DataTypes) => {

  const Car = sequelize.define("Car", {
    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: DataTypes.NULL,
    },
    plate: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: DataTypes.NULL,
    },
    active: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      defaultValue: DataTypes.NULL,
    } 

  },
  {
    tableName: 'car',
    timestamps: true,
    paranoid: true,     // soft delete
    underscored: true,
  })

  return Car


}

