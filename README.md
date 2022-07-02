# Simple CRM
This is a simple CRM project includes `api`, `webapp` and `database settings`.

## Features
- A user can list all customers, filter and sort on most of the fields.
- A user can update a customer's status.
- A user can list all opportunities of a specified customer, and sort by `name` and `status`.
- A user can add a new opportunity to the specified customer.
- A user can update an existing opportunity of the specified customer.

## Getting started locally
### Serve Database
`Docker` will be required, start `postgres` daemon by running script:
```bash
$ cd db # make sure to run under this folder to get correct context
$ ./run.sh
```

To initialize database, run `ddl.sql` in `db` folder.

Since we don't support creating customer feature so far, please run `customers.sql` in db folder to create a sample list of customers.

### Serve API
API is a NodeJS server written in `TypeScript`, with `ExpressJS` support.

To run API locally, run
```bash
$ cd api
$ yarn build && yarn start
$ # yarn debug ## alternative for local debug use
```

Environment variables are in file `.env`, please update when database connection info is changed.

### Searve Web app
Web app is a `NextJS` app in `TypeScript`.

To run Web app locally, run
```bash
$ cd app
$ yarn dev
```

Environment variables are in file `.env.development`.

## Notes
### API notes
> Lightweight, fast start and easy to host in docker. It's eco to do with simple task like in this case.

1. a global error handler is used to capture and return error messages in response.


### Web app notes
> The `NextJS` is based on `ReactJS`, 2 most advantages imo are "dynamic routing" and "swr".
 With "dynamic routing" I don't need to handle the react routers.
 With 'swr" support, api `get` requests can be faster as using `cdn`.

1. styles: As there are not too much UI designs, instead of using `Material UI` or similar, I customized components by using `styled-components` to manage styling, avoid to install too much packages.
2. context: Instead of using reducer, a "customer context" is provided.

## Next steps
### Authentication and Authorization
1. use `AWS amplify` or `Firebase auth` as authentication provider.
2. API to add security middleware verify `Bearer` token, and do authorization with different user roles.
3. Web app to add an interceptor in `axios`, and provide an "auth context" for authorization.

### Infrastructure
1. both Web app and API to be served in docker
2. create a load balancer/upstream server, traffic splitting by `location /api` to api, and rest to web app
3. remove `cors` and increase security after step 2
4. config load balancer cdn to manage cache
5. database to be in a VPC that is not open to public