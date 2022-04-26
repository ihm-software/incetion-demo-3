"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const routes_1 = require("./routes");
const lambda_api_1 = __importDefault(require("lambda-api"));
const core_1 = __importDefault(require("@middy/core"));
const ssm_1 = __importDefault(require("@middy/ssm"));
const api = (0, lambda_api_1.default)();
const debug = process.env.DEBUG === 'true' || false;
const log = (text, o) => {
    if (debug)
        console.log(text, o);
};
const region = process.env.AWS_REGION;
api.post('/', routes_1.createJob);
api.put('/:jobkey', routes_1.putJob);
api.post('/addorupdate', routes_1.addOrUpdateJob);
api.get('/replayjob/:jobkey', routes_1.replayJob);
api.get('/runjob/:jobkey', routes_1.runJob);
api.post('/runjob', routes_1.createAndRunJob);
api.post('/schedule/jobInstance/:schedulekey', routes_1.createJobInstance);
api.post('/schedule/addOrUpdateSchedule', routes_1.addOrUpdateSchedule);
api.post('/schedule', routes_1.createSchedule);
api.delete('/schedule/:schedulekey', routes_1.deleteSchedule);
api.patch('/schedule/:schedulekey', routes_1.patchSchedule);
api.put('/schedule/:schedulekey', routes_1.putSchedule);
exports.handler = (0, core_1.default)(async (event, context) => {
    log('Starting lambda', { event, context });
    if (!region)
        throw new Error('Missing environment variable: AWS_REGION is undefined');
    try {
        return await api.run(event, context);
    }
    catch (e) {
        console.log(e);
        return null;
    }
}).use((0, ssm_1.default)({
    fetchData: {
        CLUSTER: '/soundplus/cluster',
        CONSUL_TOKEN: '/soundplus/consul-token',
        CONSUL_URL: '/soundplus/consul-url',
        CONSUL_URI_KEY: '/soundplus/consul-uri-key',
    },
    setToEnv: true,
    awsClientOptions: {
        region: region,
    },
}));
//# sourceMappingURL=handler.js.map