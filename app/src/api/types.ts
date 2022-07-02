export interface Customer {
    id: string;
    status: CustomerStatus;
    created: Date;
    name: string;
    phone: string;
    email: string;
    address: string;
    description?: string;
}

export interface Opportunity {
    id: string;
    cid: string;
    status: OpportunityStatus,
    name: string;
}

export enum CustomerStatus {
    ACTIVE = 'Active',
    NON_ACTIVE = 'Non-Active',
    LEAD = 'Lead',
}

export enum OpportunityStatus {
    NEW = 'New',
    CLOSED_WON = 'Closed Won',
    CLOSED_LOST = 'Closed Lost'
}