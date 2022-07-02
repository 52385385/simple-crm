import { ErrorMessage, FormikConfig, Form as FormikForm, Formik } from "formik";
import { PropsWithChildren } from "react";
import styled from "styled-components";

const Lbl = styled.label`
    text-transform: uppercase;
    display: block;
    font-weight: bold;
    font-size: 10px;
`;

export const GeneralErr = styled.div`
    font-size: 0.8em;
    color: red;
    margin: 0.4em 0;
`

const Grp = styled.div`
    margin-bottom: 1rem;
`;

export const Label = (props: PropsWithChildren<{ forName?: string }>) => {
    return <Lbl htmlFor={props.forName}>{props.children}</Lbl>
}

export const Error = (props: { forName: string, err?: string }) => {
    if (props.err) {
        return <GeneralErr>{props.err}</GeneralErr>
    }
    return <GeneralErr><ErrorMessage name={props.forName} /></GeneralErr>
}

export const Group = (props: PropsWithChildren) => {
    return <Grp>{props.children}</Grp>
}

export const Form = <Values = unknown>(props: PropsWithChildren<FormikConfig<Values>>) => {
    return (
        <Formik
            initialValues={props.initialValues}
            validationSchema={props.validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            innerRef={props.innerRef}
            onSubmit={props.onSubmit}
            onReset={props.onReset}
            enableReinitialize={props.enableReinitialize}
        >
            <FormikForm>{props.children}</FormikForm>
        </Formik>
    );
};