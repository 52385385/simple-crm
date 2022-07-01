import styled from "styled-components";

export const Table = styled.table`
    width: 100%;
    margin: 1em 0;
    border-collapse: collapse;
    border: none;
    text-align: left;
`;

export const TableHeadingContainer = styled.div`
    width: 100%;
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody`
    > tr td {
        border-bottom: 1px solid #333;
    }
`;

export const Tr = styled.tr<{ noHover?: boolean }>`
    &:hover {
        background-color: ${(props) => !props.noHover ? '#eee' : 'transparent'};
    }
`;

export const Th = styled.th<{ sortable?: boolean }>`
    font-size: 12px;
    padding: 1.2em 5px;
    vertical-align: middle;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: ${(props) => props.sortable ? 'pointer' : 'auto'};
`;

export const Td = styled.td`
    font-size: 15px;
    padding: 0.5em 3px;
`;
