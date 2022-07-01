import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useCustomers } from '../api/customers';
import { Customer } from '../api/types';
import { SearchInput } from '../components/Inputs';
import PageContainer from '../components/PageContainer';
import { Table, TableHeadingContainer, Tbody, Td, Th, Thead, Tr } from '../components/Table';

export default function Customers() {
    const { data, mutate: mutateCustomers } = useCustomers();
    const [orderBy, setOrderBy] = useState<string>();
    const [asc, setAsc] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>();

    const sort = useCallback((_orderBy: string) => {
        if (_orderBy === orderBy) {
            setAsc(asc => !asc);
        } else {
            setOrderBy(_orderBy);
            setAsc(true);
        }
    }, [orderBy]);

    const customers: Customer[] = useMemo(() => {
        let _customers = data ?? [];
        if (filter) {
            _customers = _customers.filter(({ name, email, phone, address, description }) =>
                `${name}${email}${phone}${address}${description ?? ''}`.includes(filter))
        }
        if (orderBy) {
            _customers = _customers.sort((a, b) => asc ?
                //@ts-ignore
                (a[orderBy] ?? '').localeCompare((b[orderBy] ?? '')) :
                //@ts-ignore
                (b[orderBy] ?? '').localeCompare((a[orderBy] ?? '')));
        }
        return _customers;
    }, [data, filter, orderBy, asc]);

    return (
        <PageContainer>
            <TableHeadingContainer>
                <h2>Customers</h2>
                <SearchInput onChange={setFilter} />
            </TableHeadingContainer>
            <Table>
                <Thead>
                    <Tr noHover>
                        <Th sortable onClick={() => sort('name')}>Name<Icon>&#8597;</Icon></Th>
                        <Th sortable onClick={() => sort('email')}>Email<Icon>&#8597;</Icon></Th>
                        <Th sortable onClick={() => sort('phone')}>Phone<Icon>&#8597;</Icon></Th>
                        <Th sortable onClick={() => sort('address')}>Address<Icon>&#8597;</Icon></Th>
                        <Th sortable onClick={() => sort('description')}>Description<Icon>&#8597;</Icon></Th>
                        <Th sortable onClick={() => sort('status')}>Status<Icon>&#8597;</Icon></Th>
                        <Th>Opportunities</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {customers?.map(cus =>
                        <Tr key={cus.id}>
                            <Td>{cus.name}</Td>
                            <Td>{cus.email}</Td>
                            <Td>{cus.phone}</Td>
                            <Td>{cus.address}</Td>
                            <Td>{cus.description}</Td>
                            <Td>{cus.status}</Td>
                            <Td><Link href={`/opportunities/${cus.id}`}>View</Link></Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </PageContainer>
    )
}

const Icon = styled.span`
    font-size: 1.2em;
    margin-left: 3px;
`
