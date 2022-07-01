import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid gray;
    border-radius: 6px;
`;

const Input = styled.input`
    border: none;
    padding: 9px 18px;
    &:focus {
        outline: none;
    }
`;

const Icon = styled.span<{ clickable?: boolean }>`
    margin: auto 9px;
    cursor: ${props => props.clickable ? 'pointer' : 'default'};
`;

type InputProps = {
    onChange?: (value: string) => void;
}

export const SearchInput = (props: InputProps) => {
    const [content, setContent] = useState<string>();

    const onChange = (value: string) => {
        props.onChange?.(value);
        setContent(value);
    }

    return (
        <Container>
            <Input value={content ?? ''} onChange={e => onChange(e.target.value)} />
            {content && <Icon clickable onClick={() => setContent(undefined)}>&#10799;</Icon>}
            <Icon>&#128269;</Icon>
        </Container>
    )
}