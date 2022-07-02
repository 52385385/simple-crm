import { PropsWithChildren, SyntheticEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Panel from "./Panel";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
}

const Backdrop = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background: rgba(128,128,128,0.7);

    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    min-width: 450px;
    max-width: 50vw;
    z-index: 101;
    opacity: 100;
`;

export default function Dialog(props: PropsWithChildren<DialogProps>) {
    const { open, onClose, title, children } = props;

    const [element, setElement] = useState<HTMLElement>();

    useEffect(() => {
        setElement(document.body);
        const close = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", close);
        return () => window.removeEventListener("keydown", close);
    }, [onClose]);

    useEffect(() => {
        // prevent scroll
        if (open) {
            document.body.style.setProperty("overflow", "hidden");
        } else {
            document.body.style.removeProperty("overflow");
        }
    }, [open]);

    // always allow scroll on unmount
    useEffect(() => {
        return () => {
            document.body.style.removeProperty("overflow");
        };
    }, []);

    // capture clicks inside container
    const onContainerClick = (e: SyntheticEvent) => {
        e.stopPropagation();
    };

    if (!element || !open) {
        return null;
    }

    const dialog = (
        <Backdrop onClick={onClose}>
            <Container onClick={onContainerClick}>
                <Panel title={title}>{children}</Panel>
            </Container>
        </Backdrop>
    );

    return createPortal(dialog, element);
}
