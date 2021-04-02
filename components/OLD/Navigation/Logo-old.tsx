import { MouseEventHandler } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import theme from '../theme/produtrip.theme';
import { defaultProps, Box, BoxProps } from 'grommet';
import { Close } from 'grommet-icons';

const Container = styled.div<{ vertical?: true }>`
  display: flex;
  flex-direction: ${(props) => {
    return props.vertical ? 'column' : 'row';
  }};

  ${(props) => props.vertical && `align-items: center;`}
`;

const Surface = styled.div<{ scale: number }>`
  width: ${(props) => 60 * props.scale}px;
  height: ${(props) => 60 * props.scale}px;
  border-radius: 50%;
  background-color: ${theme.global.colors['!brand-yellow']};
  position: relative;
  cursor: pointer;
`;

const StyledImage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-42.5%, -42.5%) scale(1.35);
`;

const TitleContainer = styled.div<{ vertical?: true }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: auto;

  ${(props) =>
    props.vertical ? `margin-top: ${defaultProps.theme.global.spacing};` : `margin-left: ${defaultProps.theme.global.spacing};`};
`;

const Title = styled.h1<{ scale: number }>`
  color: #fff;
  font-size: ${(props) => 20 * props.scale}px;
  font-family: Raleway, sans-serif;
  margin: 0;
  padding: 0;
  cursor: default;
`;

const Subtitle = styled.p<{ scale: number }>`
  color: #fff;
  font-size: ${(props) => 10 * props.scale}px;
  margin: 0;
  padding: 0;
  cursor: default;
`;

interface LogoProps {
  vertical?: true;
  scale?: number;
  removeText?: true;
  onClick?: MouseEventHandler<HTMLDivElement>;
  open?: boolean;
  animation?: BoxProps['animation'];
}

const InnerLogo = ({
  open = false,
  scale,
  onClick,
  animation,
}: {
  open?: boolean;
  scale: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
  animation: BoxProps['animation'];
}) => {
  if (open) {
    return (
      <Box
        focusIndicator={false}
        style={{ outline: 'none' }}
        border={{ color: 'brand', style: 'dashed' }}
        round={{ size: '50%' }}
        width={`${60 * scale}px`}
        height={`${60 * scale}px`}
        align='center'
        justify='center'
        onClick={onClick}
      >
        <Close />
      </Box>
    );
  } else {
    return (
      <Box
        focusIndicator={false}
        style={{ outline: 'none' }}
        background='brand'
        round={{ size: '50%' }}
        width={`${60 * scale}px`}
        height={`${60 * scale}px`}
        align='center'
        justify='center'
        onClick={onClick}
        animation={animation}
      >
        <Image src='/images/logo.png' width={40 * scale} height={50 * scale} />
      </Box>
      // <Surface scale={scale} onClick={onClick}>
      // 	<StyledImage>
      // 		<Image src='/images/logo.png' width={50 * scale} height={60 * scale} />
      // 	</StyledImage>
      // </Surface>
    );
  }
};

export const Logo: React.FC<LogoProps> = ({ vertical, animation, scale = 1, removeText, onClick, open = false }) => {
  return (
    <Container vertical={vertical}>
      <InnerLogo scale={scale} onClick={onClick} open={open} animation={animation} />

      {!removeText && (
        <TitleContainer vertical={vertical}>
          <Title scale={scale}>PDV Check-In</Title>
          <Subtitle scale={scale}>
            powered by <b>BI4u</b>
          </Subtitle>
        </TitleContainer>
      )}
    </Container>
  );
};

export default Logo;
