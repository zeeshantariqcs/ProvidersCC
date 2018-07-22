"use strict";
/**
 * Config File
 * @returns {*}
 */
Object.defineProperty(exports, "__esModule", { value: true });
let configurations = () => {
    let development = {
        secret: 'HiThereItsZEE',
        npiApiUrl: 'https://npiregistry.cms.hhs.gov/api',
        aws: {
            region: 'us-west-2',
            endpoint: 'http://localhost:8000'
        }
    };
    let production = {
        secret: 'neversacrificehappinesssdssforachievemente-pharma21234asdadasd',
        npiApiUrl: 'https://npiregistry.cms.hhs.gov/api',
        aws: {
            region: 'us-west-2',
            endpoint: 'http://localhost:8000'
        }
    };
    switch (process.env.NODE_ENV) {
        case 'development':
            return development;
        case 'production':
            return production;
        default:
            return development;
    }
};
exports.default = configurations();

//# sourceMappingURL=../maps/config/config.js.map
