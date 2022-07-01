import useSWR from "swr"
import { get } from "./fetcher"
import { Customer, Opportunity } from "./types"

export const useCustomers = () => {
    return useSWR<Customer[]>(`/api/customers`, get);
}

export const useCustomerOpportunities = (cid: string) => {
    return useSWR<Opportunity[]>(cid ? `/api/customers/${cid}/opportunities` : null, get);
}