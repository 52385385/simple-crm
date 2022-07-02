import { PropsWithChildren } from "react";
import styled from "styled-components";

export default function Panel(props: PropsWithChildren<{ title: string, plain?: boolean }>) {
    const { plain, title, children } = props;
    return (
        <Container plain={plain}>
            <Title>{title}</Title>
            <Content>{children}</Content>
        </Container>
    )
}

const Container = styled.div<{ plain?: boolean }>`
    margin-bottom: 1em;
    padding: 2em;

    ${(props) => props.plain ? null :
        `
        border-radius: 18px;
        box-shadow: 3px 3px 9px #555;
        background-color: white;
        `}
`;

const Title = styled.h2`
    display:flex;
    align-items: center;
    margin: 0;
    font-size: 25px;
    height: 48px;
`;

const Content = styled.div`
    padding: 18px;
`