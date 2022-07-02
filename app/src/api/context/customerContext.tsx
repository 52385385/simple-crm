import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useCustomers } from "../customers";
import { Customer } from "../types";

interface IContext {
    customers: { [cid: string]: Customer };
    onCustomerChange?: () => Promise<void>;
    loading?: boolean;
}

const CustomerContext = createContext<IContext>({
    customers: {}
});

export const CustomerProvider = ({ children }: PropsWithChildren<unknown>) => {
    const { data, mutate, error } = useCustomers();
    const customers = useMemo(() => {
        const _customers: { [cid: string]: Customer } = {};
        data?.forEach(c => {
            _customers[c.id] = c;
        });
        return _customers;
    }, [data])

    const onCustomerChange = async () => {
        await mutate();
    }
    return (
        <CustomerContext.Provider value={{customers, onCustomerChange, loading: !data && !error}}>
            {children}
        </CustomerContext.Provider>
    )
}

export function useCustomerContext() {
    return useContext(CustomerContext);
}