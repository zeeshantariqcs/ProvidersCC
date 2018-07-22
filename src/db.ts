import {default as config} from "./config/config";
import * as AWS from "aws-sdk";
import {ServiceConfigurationOptions} from 'aws-sdk/lib/service';


let serviceConfigOptions:ServiceConfigurationOptions = {
    region: config.aws.region,
    endpoint: config.aws.endpoint
};


export let dynamoClient = new AWS.DynamoDB.DocumentClient(serviceConfigOptions);

export let dynamoDb = new AWS.DynamoDB(serviceConfigOptions);


/***
 * @purpose: This method will only create the table if it doesn't exist
 *@param tableName
 * @param primaryKey
 * @param type
 * @param callback
 * @returns {any}
 */
export let checkAndCreateTable = (tableName,primaryKey,type, callback) => {
    let params = {TableName: tableName};
    try {
        dynamoDb.describeTable(params, function (err, data) {
            if (err) {
                const params = {
                    TableName: tableName,
                    KeySchema: [
                        {AttributeName: primaryKey, KeyType: "HASH"} //Partition key
                    ],
                    AttributeDefinitions: [
                        {AttributeName: primaryKey, AttributeType: type}
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                    }
                };

                dynamoDb.createTable(params).promise().then(data=> {
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
    } catch (error) {
        return callback(error.message);
    }


};


