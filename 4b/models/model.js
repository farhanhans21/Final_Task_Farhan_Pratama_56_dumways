const { DataTypes} = require('sequelize')
const db = require('../src/db');
model = {}
model.user_tb = db.define('user_tb',{
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email:{
    type: DataTypes.STRING,
    allowNull: true
  },
  username:{
    type: DataTypes.STRING,
    allowNull: true
  },
  password:{
    type: DataTypes.STRING,
    allowNull: true
  }
},{
  schema:"finaltask",
  timestamps: false,
  freezeTableName:true,
})
model.provinsi_tb = db.define('provinsi_tb',{
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id:{
    type: DataTypes.INTEGER,
    references:{
      model: model.user_tb,
      key: 'id'
    },
    allowNull: true
  },
  nama:{
    type: DataTypes.STRING,
    allowNull: true
  },
  diresmikan:{
    type: DataTypes.DATE,
    allowNull: true
  },
  photo:{
    type: DataTypes.STRING,
    allowNull: true
  },
  pulau:{
    type: DataTypes.STRING,
    allowNull: true
  }
},{
  schema:"finaltask",
  timestamps: false,
  freezeTableName:true, 
});

model.user_tb.hasMany(model.provinsi_tb,{foreignKey:"user_id"})
model.provinsi_tb.belongsTo(model.user_tb,{foreignKey:"user_id"})

model.kabupaten_tb = db.define('kabupaten_tb',{
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama:{
    type: DataTypes.STRING,
    allowNull: true
  },
  provinsi_id:{
    type: DataTypes.INTEGER,
    references:{
      model: model.provinsi_tb,
      key: 'id'
    },
    allowNull: true
  },
  diresmikan:{
    type: DataTypes.DATE,
    allowNull: true
  },
  photo:{
    type: DataTypes.STRING,
    allowNull: true
  }
},{
  schema:"finaltask",
  timestamps: false,
  freezeTableName:true
})


model.provinsi_tb.hasMany(model.kabupaten_tb,{foreignKey:"provinsi_id"})
model.kabupaten_tb.belongsTo(model.provinsi_tb,{foreignKey:"provinsi_id"})

module.exports = model;