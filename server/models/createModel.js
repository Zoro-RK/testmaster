const mongoose = require('mongoose');
const { isConnectedToMongo, getStore } = require('../config/db');

function createModel(modelName, schemaDefinition) {
  const schema = new mongoose.Schema(schemaDefinition, {
    timestamps: true
  });
  
  let MongooseModel;
  try {
    MongooseModel = mongoose.model(modelName);
  } catch (e) {
    MongooseModel = mongoose.model(modelName, schema);
  }

  return {
    modelName,
    schema,
    mongooseModel: MongooseModel,

    async find(query = {}) {
      if (isConnectedToMongo()) {
        return await MongooseModel.find(query).lean();
      }
      return getStore(modelName).find(query);
    },

    async findOne(query = {}) {
      if (isConnectedToMongo()) {
        return await MongooseModel.findOne(query).lean();
      }
      return getStore(modelName).findOne(query);
    },

    async findById(id) {
      if (isConnectedToMongo()) {
        return await MongooseModel.findById(id).lean();
      }
      return getStore(modelName).findById(id);
    },

    async create(data) {
      if (isConnectedToMongo()) {
        const doc = new MongooseModel(data);
        const saved = await doc.save();
        return saved.toObject();
      }
      return getStore(modelName).create(data);
    },

    async findByIdAndUpdate(id, update, options = { new: true }) {
      if (isConnectedToMongo()) {
        return await MongooseModel.findByIdAndUpdate(id, update, options).lean();
      }
      return getStore(modelName).findByIdAndUpdate(id, update, options);
    },

    async findOneAndUpdate(query, update, options = { new: true }) {
      if (isConnectedToMongo()) {
        return await MongooseModel.findOneAndUpdate(query, update, options).lean();
      }
      return getStore(modelName).findOneAndUpdate(query, update, options);
    },

    async findByIdAndDelete(id) {
      if (isConnectedToMongo()) {
        return await MongooseModel.findByIdAndDelete(id).lean();
      }
      return getStore(modelName).findByIdAndDelete(id);
    },

    async deleteMany(query = {}) {
      if (isConnectedToMongo()) {
        return await MongooseModel.deleteMany(query);
      }
      return getStore(modelName).deleteMany(query);
    },

    async countDocuments(query = {}) {
      if (isConnectedToMongo()) {
        return await MongooseModel.countDocuments(query);
      }
      return getStore(modelName).countDocuments(query);
    }
  };
}

module.exports = createModel;

