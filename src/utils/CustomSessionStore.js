// const fs = require("fs").promises;
// const EventEmitter = require("events");
// const path = require("path");
// const { v4: uuid } = require("uuid");

// class CustomSessionStore extends EventEmitter {
//   constructor(options) {
//     super();
//     this.filePath =
//       options.filePath || path.join(__dirname, "session-data.json");
//     this.sessions = {};
//     this.loadData();
//   }

//   async loadData() {
//     try {
//       const data = await fs.readFile(this.filePath, "utf8");
//       this.sessions = JSON.parse(data);
//       console.log('this.sessions', this.sessions);
//     } catch (error) {
//       // If the file doesn't exist or is empty, start with an empty sessions object
//       this.sessions = {};
//     }
//   }

//   async saveData() {
//     await fs.writeFile(
//       this.filePath,
//       JSON.stringify(this.sessions, null, 2),
//       "utf8"
//     );
//   }

//   async all(callback) {
//     return callback(null, this.sessions);
//   }

//   async destroy(sid, callback) {
//     delete this.sessions[sid];
//     await this.saveData();
//     return callback(null);
//   }

//   async clear(callback) {
//     this.sessions = {};
//     await this.saveData();
//     return callback(null);
//   }

//   async length(callback) {
//     return callback(null, Object.keys(this.sessions).length);
//   }

//   async createSession(req, sess) {
//     req.session = sess;
//   }

//   async get(sid, callback) {
//     try {
//       this.sessions[sid].reload();
//     } catch (error) {
//       console.log({ error });
//     }
//     console.log(Object.keys(this.sessions[sid] || {}), this.sessions[sid]);
//     return callback(undefined, this.sessions[sid]);
//   }

//   async set(sid, session, callback) {
//     this.sessions[sid] = session;
//     await this.saveData();
//     return callback(null);
//   }
//   async touch(sid, session, callback) {
//     // Implement the logic to touch the session (update the session's activity timestamp)
//     if (this.sessions[sid]) {
//       this.sessions[sid]._expires = Date.now();
//       await this.saveData();
//       return session;
//     }
//     callback(null);
//   }
// }

// module.exports = CustomSessionStore;

const fs = require("fs").promises;
const EventEmitter = require("events");
const path = require("path");
const { v4: uuid } = require("uuid");

const data = {};

class CustomSessionStore extends EventEmitter {
  sessions = [];
  constructor(options) {
    super();
    this.filePath =
      options.filePath || path.join(__dirname, "session-data.json");
  }

  async all(callback) {
    return callback(null, data);
  }

  async destroy(sid, callback) {
    global.data[sid] = undefined;
    return callback(null);
  }

  async clear(callback) {
    global.data = {};
  }

  async length(callback) {
    return callback(null, Object.keys(data).length);
  }

  async createSession(req, sess) {
    req.session = sess;
  }

  async get(sid, callback) {
    return callback(undefined, data[sid]);
  }

  async set(sid, session, callback) {
    data[sid] = session;
    return callback(null);
  }
}

module.exports = CustomSessionStore;
