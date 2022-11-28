import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

export const Backdrop = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 500;
`
