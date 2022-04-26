"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateObjectID = exports.generateUpdateObject = exports.releaseConnection = exports.getConnection = exports.init = exports.getKeyValueFromConsul = void 0;
const axios_1 = __importDefault(require("axios"));
const mongodb_1 = require("mongodb");
const winston_1 = require("winston");
const url_1 = __importDefault(require("url"));
const logger = (0, winston_1.createLogger)({
    transports: [new winston_1.transports.Console()],
});
const consul_token = process.env.CONSUL_TOKEN;
const consul_url = process.env.CONSUL_URL;
let mongoDbConnectionPool = null;
let mongoDbName = process.env.DB_NAME;
let mongoURI = process.env.DB_URI;
const socketTimeoutMS = Number(process.env.SOCKET_TIMEOUT_MS) || 30000;
const getKeyValueFromConsul = async (keyName, overrideConsulEndpoint, defaultValue) => {
    const consulEndpoint = overrideConsulEndpoint ? overrideConsulEndpoint : consul_url;
    logger.info(`getting key [${keyName}] value from consul: ${consulEndpoint}`);
    let response = {
        statusCode: 400,
        body: {},
    };
    console.log(consulEndpoint);
    await axios_1.default
        .get(`${consulEndpoint}/v1/kv/${keyName}?raw=true`, {
        headers: {
            'X-Consul-Token': consul_token,
        },
    })
        .then(async (value) => {
        response = value.data;
    })
        .catch(err => {
        if (defaultValue !== undefined) {
            logger.info(`Using Default Consul Key: ${defaultValue}`);
            response = defaultValue;
        }
        else {
            const errorMsg = `Problem reading Consul Key: ${keyName}, REST Error: ${err}`;
            logger.error(errorMsg);
            throw errorMsg;
        }
    });
    return Promise.resolve(response);
};
exports.getKeyValueFromConsul = getKeyValueFromConsul;
const init = async () => {
    if (!mongoURI) {
        console.log('fetching mongo URI');
        const getMongoUri = await (0, exports.getKeyValueFromConsul)(process.env.CONSUL_URI_KEY);
        mongoURI = typeof getMongoUri === 'string' ? getMongoUri : undefined;
        if (!mongoDbName && mongoURI) {
            console.log('fetching mongo DB');
            const myURL = new url_1.default.URL(mongoURI);
            mongoDbName = myURL.pathname.slice(1);
            console.log(mongoDbName);
        }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: next line
    return Promise.resolve(async () => mongoConnReleaseInactivityCount);
};
exports.init = init;
const getConnection = async (context, _waitForEventLoop = false, poolSize = 1) => {
    await (0, exports.init)();
    if (mongoDbConnectionPool && mongoDbConnectionPool.isConnected(mongoDbName)) {
        console.log('Reusing the connection from pool');
        return Promise.resolve(mongoDbConnectionPool.db(mongoDbName));
    }
    console.log(`Initializing the new connection... poolSize: ${poolSize}, socketTimeOutMS: ${socketTimeoutMS}`);
    return mongodb_1.MongoClient.connect(mongoURI, {
        useNewUrlParser: true,
        poolSize: poolSize,
        socketTimeoutMS: socketTimeoutMS,
    })
        .then(dbConnPool => {
        console.log('Initialized the new connection.');
        mongoDbConnectionPool = dbConnPool;
        return mongoDbConnectionPool.db(mongoDbName);
    })
        .catch(err => {
        logger.info(err);
        return (0, exports.getConnection)(context, false, 1);
    });
};
exports.getConnection = getConnection;
const releaseConnection = async () => {
    if (mongoDbConnectionPool && mongoDbConnectionPool.isConnected(mongoDbName)) {
        console.log('Reusing the connection from pool');
        return mongoDbConnectionPool.close();
    }
};
exports.releaseConnection = releaseConnection;
const generateUpdateObject = (entityObj, ignoreFields, replaceFields) => {
    const objstack = [
        {
            obj: entityObj,
            root: '',
        },
    ];
    const setFields = {}, unsetFields = {};
    if (!replaceFields)
        replaceFields = [];
    while (objstack.length > 0) {
        const o = objstack.pop();
        const root = o.root;
        const obj = o.obj;
        const keys = Object.keys(obj);
        for (let i = 0, length = keys.length; i < length; i++) {
            const key = keys[i];
            const newRoot = root !== '' ? `${root}.${key}` : key;
            if (obj[key] === undefined || obj[key] === null) {
                unsetFields[newRoot] = '';
            }
            else if (Array.isArray(obj[key])) {
                setFields[newRoot] = obj[key];
            }
            else if (replaceFields.includes(obj[key])) {
                setFields[newRoot] = obj[key];
            }
            //Dates come back as objects, we don't want to include dates in the object collection
            else if (typeof obj[key] === 'object' && obj[key] instanceof Date === false) {
                objstack.push({
                    obj: obj[key],
                    root: newRoot,
                });
            }
            else {
                //skip undefined values or keys need ignoring
                if (!ignoreFields.includes(newRoot)) {
                    if (obj[key] !== undefined)
                        setFields[newRoot] = obj[key];
                }
            }
        }
    }
    const returnObj = {};
    if (setFields && Object.keys(setFields).length !== 0)
        returnObj.set = setFields;
    if (unsetFields && Object.keys(unsetFields).length !== 0)
        returnObj.unset = unsetFields;
    return returnObj;
};
exports.generateUpdateObject = generateUpdateObject;
const generateObjectID = () => {
    return new mongodb_1.ObjectID();
};
exports.generateObjectID = generateObjectID;
//# sourceMappingURL=mongoDBHelper.js.map