"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const https_1 = __importDefault(require("https"));
const validator = __importStar(require("../validator"));
const db = __importStar(require("../db"));
const config_1 = __importDefault(require("../config/config"));
const node_schedule_1 = __importDefault(require("node-schedule"));
//import uuidV1 from 'uuid/v1';
const dynamoClient = db.dynamoClient;
class Providers {
    constructor() {
        /***
         *
         * @param {e.Request} req
         * @param {e.Response} res
         * @param {e.NextFunction} next
         */
        this.addProvider = (req, res, next) => {
            //Validate Form Fields
            let error = validator.validateProvider(req.body.firstName, req.body.lastName, req.body.NPINumber);
            if (error == "") {
                //Means at least 1 field is filled and now we have validated fields
                const params = {
                    TableName: "Providers",
                    Item: {
                        //"ProviderId": uuidV1(),
                        "FirstName": req.body.firstName,
                        "LastName": req.body.lastName,
                        "NPINumber": Number(req.body.NPINumber),
                        "IsFullInfo": false,
                    }
                };
                let self = this; // save object reference
                console.log("Adding a new provider...");
                dynamoClient.put(params, function (err, data) {
                    if (err) {
                        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                        res.render('index', { message: 'Ohh! Some thing went wrong, Please try again.' });
                    }
                    else {
                        console.log("Added item:", JSON.stringify(data, null, 2));
                        self.callNpiAPI(req.body.NPINumber); //Call NPI Registry API to retrieve further information
                        res.render('index', { message: 'You have been successfully registered.' });
                    }
                });
            }
            else {
                res.render('index', {
                    message: error,
                    firstName: req.body.firstName,
                    lastName: req.body.firstName,
                    NPINumber: req.body.NPINumber
                });
            }
        };
        /****
         * @purpose: Calling NPI GET API to retrieve and update further information
         * @param npi
         * @returns {Promise<void>}
         */
        this.callNpiAPI = (npi) => __awaiter(this, void 0, void 0, function* () {
            try {
                https_1.default.get(`${config_1.default.npiApiUrl}?number=${npi}`, (resp) => {
                    let data = '';
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    resp.on('end', () => {
                        if (data !== '') {
                            let parsed_data = JSON.parse(data);
                            if (typeof parsed_data.results !== "undefined" && parsed_data.results.length > 0) {
                                let taxonomies = {};
                                let addresses = {};
                                let identifiers = {};
                                if (typeof parsed_data.results[0].taxonomies !== "undefined") {
                                    taxonomies = parsed_data.results[0].taxonomies;
                                }
                                if (typeof parsed_data.results[0].addresses !== "undefined") {
                                    addresses = parsed_data.results[0].addresses;
                                }
                                if (typeof parsed_data.results[0].identifiers !== "undefined") {
                                    identifiers = parsed_data.results[0].identifiers;
                                }
                                //Let's update the dynamodb item
                                this.updateOtherDetails(npi, taxonomies, addresses, identifiers);
                            }
                        }
                    });
                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });
            }
            catch (e) {
                console.log(e);
            }
        });
        //Cron job which will be use full when NPI registry is down
        this.cronJob = () => {
            let self = this; // save object reference
            node_schedule_1.default.scheduleJob('*/1 * * * *', () => {
                console.log('The answer to life, the universe, and everything!');
                this.getItemsWithIncompleteInfo((err, data) => {
                    if (!err) {
                        data.Items.forEach(function (item) {
                            console.log(" -", item.NPINumber);
                            self.callNpiAPI(item.NPINumber);
                        });
                    }
                });
            });
        };
        /***
         * @purpose: This method will get all the providers with incomplete information.
         * @param callback
         */
        this.getItemsWithIncompleteInfo = (callback) => {
            console.log("Getting Incomplete Items");
            const params = {
                TableName: "Providers",
                ProjectionExpression: "NPINumber",
                FilterExpression: "#IsFullInfo = :is_full_info",
                ExpressionAttributeNames: {
                    "#IsFullInfo": "IsFullInfo",
                },
                ExpressionAttributeValues: {
                    ":is_full_info": false
                }
            };
            dynamoClient.scan(params, function (err, data) {
                if (err) {
                    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                    return callback(err, null);
                }
                else {
                    console.log(`Query succeeded. ${JSON.stringify(data)}`);
                    return callback(null, data);
                }
            });
        };
        /***
         *
         * @param npi
         * @param taxonomies
         * @param addresses
         * @param identifier
         */
        this.updateOtherDetails = (npi, taxonomies, addresses, identifier) => {
            //Remove Blank Attributes from an object (Because dynamoDB throws error with attributes with empty string)
            const removeEmpty = (obj) => {
                Object.keys(obj).forEach(k => (obj[k] && typeof obj[k] === 'object') && removeEmpty(obj[k]) ||
                    (!obj[k] && obj[k] !== undefined) && delete obj[k]);
                return obj;
            };
            removeEmpty(addresses);
            removeEmpty(taxonomies);
            removeEmpty(identifier);
            // console.log(`TAXO ${JSON.stringify(taxonomies)}`);
            // console.log(`Addr ${JSON.stringify(addresses)}`);
            // console.log(`Ident ${JSON.stringify(identifier)}`);
            let params = {
                TableName: "Providers",
                Key: {
                    "NPINumber": Number(npi)
                },
                //ConditionExpression: "NPINumber = :id",
                ExpressionAttributeValues: {
                    ":addresses": addresses,
                    ":identifier": identifier,
                    ":taxonomies": taxonomies,
                    ":is_full_info": true
                },
                UpdateExpression: "SET Taxonomies = :taxonomies, Addresses = :addresses,  Identifier = :identifier, IsFullInfo= :is_full_info",
                ReturnValues: "UPDATED_NEW"
            };
            console.log("Attempting a conditional update...");
            dynamoClient.update(params, function (err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                }
                else {
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                }
            });
        };
    }
}
exports.default = new Providers();

//# sourceMappingURL=../maps/controllers/provider.js.map
