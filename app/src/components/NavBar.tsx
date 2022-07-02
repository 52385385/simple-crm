import styled from "styled-components";

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 55px;
    z-index: 10;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    box-shadow: 0px 2px 4px #ddd;
    white-space: nowrap;
`;

const Group = styled.div`
    display: flex;
    align-items: center;
    margin-left: 32px;
    margin-right: 32px;
`;

const NavBar = () => {
    return (
        <Container>
            <Group>
                <h1>Simple CMS</h1>
            </Group>
        </Container>
    )
}

export default NavBar;