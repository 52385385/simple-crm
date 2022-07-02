import { Field, FieldProps } from "formik";
import { useState } from "react";
import styled from "styled-components";
import ReactSlect from 'react-select';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 6px;
    min-height: 36px;
`;

const Input = styled.input`
    border: none;
    padding: 6px;
    min-height: 12px;
    width: 100%;
    &:focus {
        outline: none;
    }
    &:disabled {
        background-color: #eee;
        color: #aaa;
        cursor: not-allowed;
    }
`;

const Icon = styled.span<{ clickable?: boolean }>`
    margin: auto 9px;
    cursor: ${props => props.clickable ? 'pointer' : 'default'};
`;

type InputProps = {
    name: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

type SelectProps = {
    options: Array<{ value: string, label: string }>,
} & InputProps

export const SearchInput = (props: InputProps) => {
    const [content, setContent] = useState<string>();

    const onChange = (value: string) => {
        props.onChange?.(value);
        setContent(value);
    }

    return (
        <Container>
            <Input value={content ?? ''} onChange={e => onChange(e.target.value)} />
            {content && <Icon clickable onClick={() => onChange('')}>&#10799;</Icon>}
            <Icon>&#128269;</Icon>
        </Container>
    )
}

export const FormikInput = (props: InputProps) => {
    return (
        <Field name={props.name}>
            {({ field }: FieldProps) => <Container><Input {...props} {...field} /></Container>}
        </Field>
    )
}

export const FormikSelect = (props: SelectProps) => {
    return (
        <Field name={props.name}>
            {({ form, field }: FieldProps) => {
                const { name, options, disabled } = props;
                const onChange = (value?: string) => {
                    form.setFieldValue(field.name, value);
                };
                const value = () => {
                    return options.find(o => o.value === field.value)
                }

                return (
                    <ReactSlect
                        {...field}
                        name={name}
                        options={options}
                        isDisabled={disabled}
                        value={value()}
                        onChange={v => onChange(v?.value)}
                    />
                )
            }}
        </Field>
    )
}