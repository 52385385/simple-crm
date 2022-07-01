import dotenv from "dotenv";
import { Pool } from "pg";
import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import errorHandler from "./errors/errorHandler";
import CustomerController from "./controllers/customers";

dotenv.config();

const {
    PGHOST,
    PGUSER,
    PGPASSWORD,
    PGDATABASE,
    PGPORT,
} = process.env;

const db = new Pool({
    host: PGHOST,
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    port: PGPORT ? Number(PGPORT) : undefined,
    connectionTimeoutMillis: 2000,
    max: 10,
});

const customerController = new CustomerController(db);

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/customers', customerController.getCustomers);
app.put('/api/customers/:customerId', customerController.updateStatus);
app.get('/api/customers/:customerId/opportunities', customerController.getOpportunitiesByCustomer);
app.post('/api/customers/:customerId/opportunities', customerController.addOpportunityToCustomer);
app.put('/api/customers/:customerId/opportunities/:opportunityId', customerController.updateOpportunity);

app.use(errorHandler);

app.listen(8080, () => {
    console.log('API running on 8080');
});