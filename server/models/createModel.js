const mongoose = require('mongoose');
const { isConnectedToMongo, getStore } = require('../config/db');

function createModel(modelName, schemaDefinition) {
  // Allow flexible schema with timestamps
  const schema = new mongoose.Schema(schemaDefinition, {
    timestamps: true,
    strict: false,
    _id: false // Allow custom string IDs or default ObjectIds
  });
  
  // Ensure _id is defined as Mixed so both String and ObjectId work without CastError
  if (!schemaDefinition._id) {
    schema.add({ _id: { type: mongoose.Schema.Types.Mixed } });
  }

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
        try {
          const docs = await MongooseModel.find(query).lean();
          return docs || [];
        } catch (e) {
          // fallback to store only on connection/query failure
        }
      }
      return getStore(modelName).find(query);
    },

    async findOne(query = {}) {
      if (isConnectedToMongo()) {
        try {
          const doc = await MongooseModel.findOne(query).lean();
          return doc || null;
        } catch (e) {
          // fallback to store only on connection/query failure
        }
      }
      return getStore(modelName).findOne(query);
    },

    async findById(id) {
      if (!id) return null;
      if (isConnectedToMongo()) {
        try {
          if (mongoose.isValidObjectId(id)) {
            const objId = new mongoose.Types.ObjectId(id);
            const doc = await MongooseModel.findOne({ _id: objId }).lean() || await MongooseModel.findById(id).lean();
            if (doc) return doc;
          }
          const byStr = await MongooseModel.findOne({ _id: String(id) }).lean() || await MongooseModel.findOne({ id: String(id) }).lean();
          return byStr || null;
        } catch (e) {
          // fallback to store only on connection/query failure
        }
      }
      return getStore(modelName).findById(id);
    },

    async create(data) {
      const generatedId = data._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const docWithId = {
        _id: generatedId,
        ...data
      };

      if (isConnectedToMongo()) {
        try {
          const doc = new MongooseModel(docWithId);
          const saved = await doc.save();
          // Also sync to JsonStore for offline consistency
          try { getStore(modelName).create(saved.toObject()); } catch (e) {}
          return saved.toObject();
        } catch (e) {
          console.warn(`Mongo create failed, falling back to JsonStore:`, e.message);
        }
      }
      return getStore(modelName).create(docWithId);
    },

    async findByIdAndUpdate(id, update, options = { new: true }) {
      if (!id) return null;
      if (isConnectedToMongo()) {
        try {
          if (mongoose.isValidObjectId(id)) {
            const objId = new mongoose.Types.ObjectId(id);
            let updated = await MongooseModel.findOneAndUpdate({ _id: objId }, update, options).lean();
            if (!updated) updated = await MongooseModel.findByIdAndUpdate(id, update, options).lean();
            if (updated) {
              try { getStore(modelName).findByIdAndUpdate(id, update, options); } catch(e){}
              return updated;
            }
          }
          const byStr = await MongooseModel.findOneAndUpdate({ _id: String(id) }, update, options).lean();
          if (byStr) {
            try { getStore(modelName).findByIdAndUpdate(id, update, options); } catch(e){}
            return byStr;
          }
        } catch (e) {
          // fallback
        }
      }
      return getStore(modelName).findByIdAndUpdate(id, update, options);
    },

    async findOneAndUpdate(query, update, options = { new: true }) {
      if (isConnectedToMongo()) {
        try {
          const updated = await MongooseModel.findOneAndUpdate(query, update, options).lean();
          if (updated) return updated;
        } catch (e) {
          // fallback
        }
      }
      return getStore(modelName).findOneAndUpdate(query, update, options);
    },

    async findByIdAndDelete(id) {
      if (!id) return null;
      if (isConnectedToMongo()) {
        try {
          if (mongoose.isValidObjectId(id)) {
            const objId = new mongoose.Types.ObjectId(id);
            let del = await MongooseModel.findOneAndDelete({ _id: objId }).lean();
            if (!del) del = await MongooseModel.findByIdAndDelete(id).lean();
            if (del) {
              try { getStore(modelName).findByIdAndDelete(id); } catch(e){}
              return del;
            }
          }
          const delStr = await MongooseModel.findOneAndDelete({ _id: String(id) }).lean();
          if (delStr) {
            try { getStore(modelName).findByIdAndDelete(id); } catch(e){}
            return delStr;
          }
        } catch (e) {
          // fallback
        }
      }
      return getStore(modelName).findByIdAndDelete(id);
    },

    async deleteMany(query = {}) {
      if (isConnectedToMongo()) {
        try {
          const res = await MongooseModel.deleteMany(query);
          try { getStore(modelName).deleteMany(query); } catch(e){}
          return res;
        } catch (e) {}
      }
      return getStore(modelName).deleteMany(query);
    },

    async countDocuments(query = {}) {
      if (isConnectedToMongo()) {
        try {
          return await MongooseModel.countDocuments(query);
        } catch (e) {}
      }
      return getStore(modelName).countDocuments(query);
    }
  };
}

module.exports = createModel;
