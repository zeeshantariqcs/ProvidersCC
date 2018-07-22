/**
 * Config File
 * @returns {*}
 */

let configurations = () => {

    let development = {
        secret: 'HiThereItsZEE',
        npiApiUrl:'https://npiregistry.cms.hhs.gov/api',
        aws: {
            region: 'us-west-2',
            endpoint: 'http://localhost:8000'
        }
    };

    let production = {
        secret: 'neversacrificehappinesssdssforachievemente-pharma21234asdadasd',
        npiApiUrl:'https://npiregistry.cms.hhs.gov/api',
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

export default configurations();

