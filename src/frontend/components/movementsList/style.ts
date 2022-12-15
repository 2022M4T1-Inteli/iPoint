import styled from 'styled-components'

export const Container = styled.div`
    display: grid;
    grid-gap: 1rem;

`

export const Item = styled.div`
    display: flex;
    grid-gap: 2rem;
    align-items: center;
    font-size: 1.6rem;
    justify-content: space-between;
    color: ${props => props.theme.colors.greyDark1};
    text-align: center;
    padding: 0 4rem;

    p {
        font-weight: 600;
    }
`
