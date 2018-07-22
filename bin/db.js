"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config/config"));
const AWS = __importStar(require("aws-sdk"));
let serviceConfigOptions = {
    region: config_1.default.aws.region,
    endpoint: config_1.default.aws.endpoint
};
exports.dynamoClient = new AWS.DynamoDB.DocumentClient(serviceConfigOptions);
exports.dynamoDb = new AWS.DynamoDB(serviceConfigOptions);
/***
 * @purpose: This method will only create the table if it doesn't exist
 *@param tableName
 * @param primaryKey
 * @param type
 * @param callback
 * @returns {any}
 */
exports.checkAndCreateTable = (tableName, primaryKey, type, callback) => {
    let params = { TableName: tableName };
    try {
        exports.dynamoDb.describeTable(params, function (err, data) {
            if (err) {
                const params = {
                    TableName: tableName,
                    KeySchema: [
                        { AttributeName: primaryKey, KeyType: "HASH" } //Partition key
                    ],
                    AttributeDefinitions: [
                        { AttributeName: primaryKey, AttributeType: type }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                    }
                };
                exports.dynamoDb.createTable(params).promise().then(data => {
                    console.log(`Created table ${tableName}`);
                    return callback(data);
                }).catch(error => {
                    return callback(error.message);
                });
            }
            else {
                return callback("table already exist");
            }
        });
    }
    catch (error) {
        return callback(error.message);
    }
};

//# sourceMappingURL=maps/db.js.map
