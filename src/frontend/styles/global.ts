import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
	* {
		margin: 0;
		padding: 0;
		box-sizing: inherit;
	}

	html {
		font-size: 62.5%;
		box-sizing: border-box;

        @media only screen and (max-width: 100em) {
            font-size: 56.25%; //1 rem = 9px, 9/16 = 56.25%
        } //1600px

        @media only screen and (max-width: 75em) {
            font-size: 50%; //1 rem = 8px, 8/16 = 50%
        } //1200px

        @media only screen and (max-width: 37.5em) {
            font-size: 43.75%; //1 rem = 7px, 7/16 = 43.75%
        } //600px
	}

    body {
        background-color: ${({ theme }) => theme.colors.white};
        font-family: 'Montserrat', sans-serif;
        color: ${props => props.theme.colors.greyDark2};
        min-height: 100vh;
    }

    .Toastify__toast-body {
        font-size: 1.6rem !important;
    }
`
