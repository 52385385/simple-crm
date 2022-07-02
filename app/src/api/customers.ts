import useSWR from "swr"
import { get, post, put } from "./fetcher"
import { Customer, CustomerStatus, Opportunity } from "./types"

export const useCustomers = () => {
    return useSWR<Customer[]>(`/api/customers`, get);
}

export const useCustomerOpportunities = (cid?: string) => {
    return useSWR<Opportunity[]>(cid ? `/api/customers/${cid}/opportunities` : null, get);
}

export const updateCustomerStatus = (cid: string, request: { status: CustomerStatus }): Promise<Customer> => {
    return put(`/api/customers/${cid}`, request);
}

export const addOpportunityToCustomer = (cid: string, request: { name: string }): Promise<Opportunity> => {
    return post(`/api/customers/${cid}/opportunities`, request);
}

export const updateOpportunity = (cid: string, oid: string, request: Omit<Opportunity, 'id' | 'cid'>): Promise<Opportunity> => {
    return put(`/api/customers/${cid}/opportunities/${oid}`, request);
}