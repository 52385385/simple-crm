import Link from "next/link";
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useState } from "react";
import * as Yup from 'yup';
import { useCustomerContext } from "../../api/context/customerContext";
import { addOpportunityToCustomer, updateOpportunity, useCustomerOpportunities } from "../../api/customers";
import { Opportunity, OpportunityStatus } from "../../api/types";
import Button from "../../components/Button";
import Dialog from "../../components/Dialog";
import { Error, Form, GeneralErr, Group, Label } from "../../components/Form";
import { FormikInput, FormikSelect } from "../../components/Inputs";
import PageContainer from "../../components/PageContainer";
import { TableHeadingContainer, Tbody, Table, Tr, Th, Td, Thead, ThIcon } from "../../components/Table";

export default function CustomerOpportunities() {
    const router = useRouter();
    const cid = router.query.cid as string;
    const { customers, loading } = useCustomerContext();
    const { data, mutate } = useCustomerOpportunities(cid);
    const [selectedOpp, setSelectedOpp] = useState<Opportunity>();
    const [show, setShow] = useState<boolean>(false);
    const [err, setErr] = useState<string>();
    const [orderBy, setOrderBy] = useState<string>();
    const [asc, setAsc] = useState<boolean>(true);

    useEffect(() => {
        if (!cid || !loading && !customers[cid]) {
            console.log('No customer found by cid:', cid);
            router.push('/');
        }
    }, [cid, loading, customers, router]);

    const sort = useCallback((_orderBy: string) => {
        if (_orderBy === orderBy) {
            setAsc(asc => !asc);
        } else {
            setOrderBy(_orderBy);
            setAsc(true);
        }
    }, [orderBy]);

    const onEdit = (opp: Opportunity) => {
        setSelectedOpp(opp);
        setShow(true);
    }

    const onNew = () => {
        setSelectedOpp(undefined);
        setShow(true);
    }

    const onHide = () => {
        setSelectedOpp(undefined);
        setShow(false);
    }

    const onSubmit = async (values: {name?: string, status?: OpportunityStatus}) => {
        console.log(values)
        try {
            if (selectedOpp) {
                //to update
                await updateOpportunity(cid, selectedOpp.id, {name: values.name!, status: values.status!})
            } else {
                //new
                await addOpportunityToCustomer(cid, {name: values.name!})
            }
            await mutate();
            onHide();
        } catch (error: any) {
            setErr(error.message)
        }
    }

    const opportunities = useMemo(() => {
        let _opp = data;
        if (orderBy) {
            _opp = _opp?.sort((a, b) => asc ?
                //@ts-ignore
                (a[orderBy] ?? '').localeCompare((b[orderBy] ?? '')) :
                //@ts-ignore
                (b[orderBy] ?? '').localeCompare((a[orderBy] ?? '')));
        }
        return _opp;
    }, [data, orderBy, asc])

    return (
        <PageContainer>
            <Link href={'/'}>Back to dashboard</Link>
            <TableHeadingContainer>
                <h2>Opportunities for {customers[cid]?.name}</h2>
                <Button onClick={onNew}>Add a new opportunity</Button>
            </TableHeadingContainer>
            <Table>
                <Thead>
                    <Tr noHover>
                        <Th sortable onClick={() => sort('name')}>Name<ThIcon>&#8597;</ThIcon></Th>
                        <Th sortable onClick={() => sort('status')}>Status<ThIcon>&#8597;</ThIcon></Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {opportunities?.map(opp =>
                        <Tr key={opp.id}>
                            <Td>{opp.name}</Td>
                            <Td>{opp.status}</Td>
                            <Td><Button link onClick={() => onEdit(opp)}>Edit</Button></Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
            <Dialog open={show}
                title={selectedOpp ? 'Update opportunity' : 'Add a new opportunity'}
                onClose={onHide}>
                <Form
                    initialValues={{ name: selectedOpp?.name, status: selectedOpp?.status }}
                    onSubmit={onSubmit}
                    validationSchema={selectedOpp ? schemaEdit : schemaNew}
                >
                    <Group>
                        <Label forName="name">name</Label>
                        <FormikInput name='name' />
                        <Error forName='name'/>
                    </Group>
                    {selectedOpp &&
                        <Group>
                            <Label forName="status">status</Label>
                            <FormikSelect name='status' options={OPPORTUNITY_STATUS_OPTIONS} />
                            <Error forName='status' />
                        </Group>
                    }
                    <Button type='submit'>{selectedOpp ? 'Update' : 'Add'}</Button>
                    {err && <GeneralErr>{err}</GeneralErr>}
                </Form>
            </Dialog>
        </PageContainer>
    )
}

const OPPORTUNITY_STATUS_OPTIONS: Array<{ value: string, label: string }> = [
    { value: OpportunityStatus.NEW, label: OpportunityStatus.NEW },
    { value: OpportunityStatus.CLOSED_WON, label: OpportunityStatus.CLOSED_WON },
    { value: OpportunityStatus.CLOSED_LOST, label: OpportunityStatus.CLOSED_LOST },
]

const schemaEdit = Yup.object({
    name: Yup.string().required('Opportunity name is required'),
    status: Yup.string().required('Please select a status')
});
const schemaNew = Yup.object({
    name: Yup.string().required('Opportunity name is required'),
})