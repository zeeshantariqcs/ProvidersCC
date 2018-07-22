# Project Assessment

Providers Registry is NodeJS Express based app that use to store Providers information and make it complete by looking up in NPI(National Provider Identifier) Registry.
In HealthCare term Provider is used for Doctor of medicine or more generally any medical practitioner.
The Application take inputs from any user using web based form and store it in database. The information gather from user is minimal for more complete information it will query NPI API based on user inputs and collect necessary information and write it in database.

## Tasks
You can consider the following points as requirements, so, please give them your attention!

1. This application is rendering a form to take input from user and receive it on API endpoint `/register`.
2. Complete the code of `/register` endpoint to store information in database.
3. Use DynamoDb Local for storing information. There should be a single table `Providers`.
4. After receiving inputs from user on API endpoint, It should look up in NPI Registry for retrieval and persistence of rest of information
5. NPI Registry might be facing downtime but we don't want our users to be affected by NPI downtime. So the information gathering from NPI should be done in a background queue or process.
6. Write unit tests to ensure the functionality of application. Code coverage must be above 70%.

## Notes
- The NPI registry API link is in links section.
- Data validations are important.
- The Provider fields input by user are FirstName, LastName and NPI Number. All form fields are optional
- The fields needed to get from NPI Registry are taxonomies, addresses and identifiers they all are collections of Objects. It's up to you how you write them in database.
- The DynamoDb should automatically start on application launch.


## We'll be evaluating your submission from the following perspectives:
- Code quality and best practices
- Implementation of new feature
- Unit Tests

## Dependencies
- NodeJS 8.9.x
- Npm  5.x

## Hints

- Install project dependencies by running `yarn` or `npm install`
- To run the app run `npm run start`


## How to deliver:
This is how we are going to run and evaluate your submission, so please make sure to run below steps before submitting your answer.

1. Make sure to run unit tests ensure there are no errors and all dependencies are properly configured.
2. Generate the code coverage report for placeholder 'coverage' directory
3. Zip archive the end result solution (Hint: to minimize the archive you can ignore the 'node_modules' directories and '.idea' directory)
4. Store your archive in a shared location where we can access and download it for evaluation and add your sharable link in response of email.

## Links

- https://npiregistry.cms.hhs.gov/registry/help-api
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html
- http://automattic.github.io/kue
- https://mochajs.org/