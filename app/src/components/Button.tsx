import { PropsWithChildren, useCallback } from 'react';
import styled from 'styled-components';

type Props = {
    onClick?: () => void,
    disabled?: boolean,
    link?: boolean,
    type?: "button" | "submit" | "reset",
}

export default function Button(props: PropsWithChildren<Props>) {
    const { children, onClick, disabled, ...rest } = props;

    const _onClick = useCallback(() => {
        if (!disabled) {
            onClick?.();
        }
    }, [disabled, onClick]);

    return <Btn onClick={_onClick} disabled={disabled} {...rest}>{children}</Btn>
}

const Btn = styled.button<Props>`
    max-height: 36px;
    padding: ${props => {
        if (props.link) {
            return '0px 18px';
        } else {
            return '9px 18px';
        }
    }};
    border: ${props => {
        const { link } = props;
        let border = '2px solid gray';
        if (link) {
            border = 'none';
        }
        return border;
    }};
    border-radius: 6px;
    font-weight: bold;
    color: ${props => {
        const { disabled, link } = props;
        let colour = 'black';
        if (disabled) {
            colour = '#afafaf'
        } else if (link) {
            colour = '#6b86ff'
        }
        return colour;
    }};
    background-color: transparent;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`
