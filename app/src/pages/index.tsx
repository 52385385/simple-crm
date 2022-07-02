import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useCustomerContext } from '../api/context/customerContext';
import { Customer, CustomerStatus } from '../api/types';
import Button from '../components/Button';
import Dialog from '../components/Dialog';
import { FormikSelect, SearchInput } from '../components/Inputs';
import PageContainer from '../components/PageContainer';
import { Table, TableHeadingContainer, Tbody, Td, Th, Thead, ThIcon, Tr } from '../components/Table';
import { Error, Form, GeneralErr, Group } from '../components/Form';
import { updateCustomerStatus } from '../api/customers';

export default function Customers() {
    const { customers: cusobj, onCustomerChange } = useCustomerContext();
    const [orderBy, setOrderBy] = useState<string>();
    const [asc, setAsc] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
    const [err, setErr] = useState<string>();

    const sort = useCallback((_orderBy: string) => {
        if (_orderBy === orderBy) {
            setAsc(asc => !asc);
        } else {
            setOrderBy(_orderBy);
            setAsc(true);
        }
    }, [orderBy]);

    const customers: Customer[] = useMemo(() => {
        let _customers = Object.values(cusobj ?? {});
        if ((filter ?? '') !== '') {
            _customers = _customers.filter(({ name, email, phone, address, description }) =>
                `${name}${email}${phone}${address}${description ?? ''}`.includes(filter!))
        }
        if (orderBy) {
            _customers = _customers.sort((a, b) => asc ?
                //@ts-ignore
                (a[orderBy] ?? '').localeCompare((b[orderBy] ?? '')) :
                //@ts-ignore
                (b[orderBy] ?? '').localeCompare((a[orderBy] ?? '')));
        }
        return _customers;
    }, [cusobj, filter, orderBy, asc]);

    const onChangeCustomerStatus = async (values: { status?: CustomerStatus }) => {
        console.log(values);
        const { status } = values;
        if (!status || !selectedCustomer || status === selectedCustomer?.status) {
            return;
        }
        try {
            await updateCustomerStatus(selectedCustomer.id, { status });
            await onCustomerChange?.();
            setSelectedCustomer(undefined);
        } catch (error: any) {
            setErr(error.message)
        }
    }

    return (
        <PageContainer>
            <TableHeadingContainer>
                <h2>Customers</h2>
                <SearchInput name='search' onChange={setFilter} />
            </TableHeadingContainer>
            <Table>
                <Thead>
                    <Tr noHover>
                        <Th sortable onClick={() => sort('name')}>Name<ThIcon>&#8597;</ThIcon></Th>
                        <Th sortable onClick={() => sort('email')}>Email<ThIcon>&#8597;</ThIcon></Th>
                        <Th sortable onClick={() => sort('phone')}>Phone<ThIcon>&#8597;</ThIcon></Th>
                        <Th sortable onClick={() => sort('address')}>Address<ThIcon>&#8597;</ThIcon></Th>
                        <Th sortable onClick={() => sort('description')}>Description<ThIcon>&#8597;</ThIcon></Th>
                        <Th sortable onClick={() => sort('status')}>Status<ThIcon>&#8597;</ThIcon></Th>
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
                            <Td><Button link onClick={() => setSelectedCustomer(cus)}>{cus.status}</Button></Td>
                            <Td><Link href={`/opportunities/${cus.id}`}>View</Link></Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
            <Dialog open={!!selectedCustomer}
                title={`Update ${selectedCustomer?.name} status`}
                onClose={() => setSelectedCustomer(undefined)}>
                <Form
                    initialValues={{ status: selectedCustomer?.status }}
                    onSubmit={onChangeCustomerStatus}
                    validationSchema={validationSchema}
                >
                    <Group>
                        <FormikSelect name='status' options={CUSTOMER_STATUS_OPTIONS} />
                        <Error forName='status' />
                    </Group>
                    <Button type='submit'>Change</Button>
                    {err && <GeneralErr>{err}</GeneralErr>}
                </Form>
            </Dialog>
        </PageContainer>
    )
}

const CUSTOMER_STATUS_OPTIONS: Array<{ value: string, label: string }> = [
    { value: CustomerStatus.ACTIVE, label: CustomerStatus.ACTIVE },
    { value: CustomerStatus.LEAD, label: CustomerStatus.LEAD },
    { value: CustomerStatus.NON_ACTIVE, label: CustomerStatus.NON_ACTIVE },
];

const validationSchema = Yup.object({
    status: Yup.string().required('Please select a status')
})
