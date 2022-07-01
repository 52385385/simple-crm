import { Request, Response, NextFunction } from 'express';
import { Pool, QueryResult } from 'pg';
import BadRequestException from '../errors/badRequestException';
import NotFoundException from '../errors/notFoundException';
import { Customer, CustomerStatus, Opportunity, Opportunity_Status } from '../types';
import { v4 as uuid } from 'uuid';
export default class CustomerController {
    private db: Pool;
    constructor(db: Pool) {
        this.db = db;
    }

    getCustomers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => { 
        try {
            const { rows } = await this.db.query('SELECT * FROM customer ORDER BY created DESC');
            res.json(rows);
        } catch (error) {
            next(error);
        }
    }

    updateStatus = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { customerId: id } = req.params;
            const { status: toStatus } = req.body as { status: CustomerStatus };
            if (![CustomerStatus.ACTIVE, CustomerStatus.LEAD, CustomerStatus.NON_ACTIVE].includes(toStatus)) {
                throw new BadRequestException('Invalid status to be updated');
            }
            const { rows }: QueryResult<Customer> = await this.db.query(
                'SELECT * FROM customer WHERE id = $1',
                [id]
            );
            if (rows.length === 0) {
                console.log('Cannot found customer with id', id);
                throw new NotFoundException('Cannot find this customer');
            }
            const { rows: customers } = await this.db.query(
                'UPDATE customer SET status = $1 WHERE id = $2 RETURNING *',
                [toStatus, id]
            );
            res.json(customers[0]);
        } catch (error) {
            next(error)
        }
    }

    getOpportunitiesByCustomer = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { customerId: cid } = req.params;
            const { rows }: QueryResult<Opportunity> = await this.db.query(
                'SELECT * FROM opportunity where cid = $1 ORDER BY created DESC',
                [cid]
            );
            res.json(rows);
        } catch (error) {
            next(error);
        }
    }

    addOpportunityToCustomer = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { customerId: cid } = req.params;
            const { name } = req.body as { name: string };
            if ((name ?? '') === '') {
                throw new BadRequestException('Opportunity name should be provided');
            }
            const { rows: customers }: QueryResult<Customer> = await this.db.query(
                'SELECT * FROM customer WHERE id = $1',
                [cid]
            );
            if (customers.length === 0) {
                console.log('Cannot found customer with id', cid);
                throw new NotFoundException('Cannot find this customer');
            }
            const { rows: opportunities }: QueryResult<Opportunity> = await this.db.query(
                'INSERT INTO opportunity (id, cid, name, status, created) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *',
                [uuid(), cid, name, Opportunity_Status.NEW]
            );
            res.json(opportunities[0]);
        } catch (error) {
            next(error);
        }
    }

    updateOpportunity = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { customerId: cid, opportunityId: oid } = req.params;
            const { name, status } = req.body as Omit<Opportunity, 'id' | 'cid'>;
            if (status && ![Opportunity_Status.CLOSED_LOST, Opportunity_Status.CLOSED_WON, Opportunity_Status.NEW].includes(status)) {
                throw new BadRequestException('Invalid status provided');
            }
            const { rows }: QueryResult<Opportunity> = await this.db.query(
                'SELECT * FROM opportunity WHERE id = $1 AND cid = $2',
                [oid, cid]
            );
            if (rows.length === 0) {
                throw new NotFoundException('Cannot find this opportunity');
            }
            const { rows: opportunities }: QueryResult<Opportunity> = await this.db.query(
                'UPDATE opportunity SET name = $1, status = $2 WHERE id = $3 RETURNING *',
                [name ?? rows[0].name, status ?? rows[0].status, oid]
            )
            res.json(opportunities[0]);
        } catch (error) {
            next(error);
        }
    }
}