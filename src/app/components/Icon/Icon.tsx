import styled from 'styled-components';
import { useIcon, type SpriteName, type SpritePath } from '../../calc/sprite';

export const StyledIcon = styled.span.attrs<{
  $background: SpritePath;
}>(({ $background }) => ({
  style: {
    backgroundImage: $background,
  },
}))``;

export const Icon = ({
  icon,
  className = '',
}: React.PropsWithChildren<{
  className?: string;
  icon?: SpriteName;
}>) => {
  const iconPath = useIcon(icon);
  return <StyledIcon $background={iconPath} className={className}></StyledIcon>;
};

export const InlineIcon = styled(Icon)`
  display: inline-block;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 1em;
  image-rendering: pixelated;
  width: 1em;
  height: 1em;
`;
