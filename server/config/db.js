const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let isConnectedToMongo = false;

// Lightweight in-memory/file-persisted fallback store for offline/sandbox environments
class JsonStore {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(dataDir, `${name}.json`);
    this.data = [];
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = [];
      }
    } catch (err) {
      console.error(`Error loading JSON store ${this.name}:`, err.message);
      this.data = [];
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error(`Error saving JSON store ${this.name}:`, err.message);
    }
  }

  find(query = {}) {
    return this.data.filter(item => {
      for (const key of Object.keys(query)) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          // If query key is an object (e.g. $in)
          if (typeof query[key] === 'object' && query[key] !== null) {
            if (query[key].$in && Array.isArray(query[key].$in)) {
              if (!query[key].$in.includes(item[key])) return false;
            }
          } else {
            return false;
          }
        }
      }
      return true;
    });
  }

  findOne(query = {}) {
    return this.find(query)[0] || null;
  }

  findById(id) {
    return this.data.find(item => String(item._id) === String(id)) || null;
  }

  create(doc) {
    const newDoc = {
      _id: doc._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    this.data.push(newDoc);
    this.save();
    return newDoc;
  }

  findByIdAndUpdate(id, update, options = {}) {
    const idx = this.data.findIndex(item => String(item._id) === String(id));
    if (idx === -1) return null;
    const current = this.data[idx];
    const updated = {
      ...current,
      ...(update.$set || update),
      updatedAt: new Date().toISOString()
    };
    this.data[idx] = updated;
    this.save();
    return options.new ? updated : current;
  }

  findOneAndUpdate(query, update, options = {}) {
    const item = this.findOne(query);
    if (!item) {
      if (options.upsert) {
        return this.create({ ...query, ...(update.$set || update) });
      }
      return null;
    }
    return this.findByIdAndUpdate(item._id, update, options);
  }

  findByIdAndDelete(id) {
    const idx = this.data.findIndex(item => String(item._id) === String(id));
    if (idx === -1) return null;
    const removed = this.data.splice(idx, 1)[0];
    this.save();
    return removed;
  }

  deleteMany(query = {}) {
    const remaining = this.data.filter(item => {
      for (const key of Object.keys(query)) {
        if (item[key] === query[key]) return false;
      }
      return true;
    });
    const count = this.data.length - remaining.length;
    this.data = remaining;
    this.save();
    return { deletedCount: count };
  }

  countDocuments(query = {}) {
    return this.find(query).length;
  }
}

const stores = {};
function getStore(name) {
  if (!stores[name]) {
    stores[name] = new JsonStore(name);
  }
  return stores[name];
}

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tnpsc_study_circle';
  try {
    // Attempt Mongoose connection with a short timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    isConnectedToMongo = true;
    console.log(`[Database] Connected successfully to MongoDB at ${mongoUri}`);
  } catch (err) {
    console.log(`[Database] MongoDB not reachable (${err.message}). Using local embedded JSON datastore in ./server/data/`);
    isConnectedToMongo = false;
  }
}

module.exports = {
  connectDB,
  isConnectedToMongo: () => isConnectedToMongo,
  getStore
};

