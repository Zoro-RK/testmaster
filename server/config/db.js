const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Configure reliable DNS servers for MongoDB Atlas SRV lookup
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

// Ensure environment variables are loaded
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

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
  let mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tnpsc_study_circle';

  // If MongoDB Atlas URI without a database name, append default tnpsc_study_circle database
  if (mongoUri.includes('mongodb+srv://') || mongoUri.includes('mongodb://')) {
    try {
      const parsed = new URL(mongoUri);
      if (!parsed.pathname || parsed.pathname === '/' || parsed.pathname === '') {
        parsed.pathname = '/tnpsc_study_circle';
        if (!parsed.searchParams.has('retryWrites')) {
          parsed.searchParams.set('retryWrites', 'true');
        }
        if (!parsed.searchParams.has('w')) {
          parsed.searchParams.set('w', 'majority');
        }
        mongoUri = parsed.toString();
      }
    } catch {
      if (mongoUri.endsWith('/')) {
        mongoUri = `${mongoUri}tnpsc_study_circle?retryWrites=true&w=majority`;
      }
    }
  }

  const isAtlas = mongoUri.includes('mongodb+srv') || mongoUri.includes('.mongodb.net');
  const timeoutMs = isAtlas ? 10000 : 3000;

  try {
    const maskedUri = mongoUri.replace(/(:\/\/[^:]+:)([^@]+)(@)/, '$1******$3');
    console.log(`[Database] Connecting to MongoDB (${isAtlas ? 'Atlas Cloud' : 'Local'})...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: timeoutMs
    });
    isConnectedToMongo = true;
    console.log(`[Database] Connected successfully to MongoDB at ${maskedUri}`);
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

