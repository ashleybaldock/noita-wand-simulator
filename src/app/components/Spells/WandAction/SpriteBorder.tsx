import styled from 'styled-components';

export const SpriteBorder = styled.div<{
  $blur?: number;
  $lineColor?: string;
  $scale?: number;
}>`
  ${({ $blur = 0, $lineColor = 'rbga(0,0,0,1)', $scale = 0.1 }) => `
  --dss: var(--sprite-outline-scale, ${$scale});
  --dsp: calc(var(--dss) * 1em);
  --dsn: calc(var(--dss) * -1em);
  --dsb: var(--sprite-outline-blur, ${$blur});
  --dsc: var(--sprite-outline-color, ${$lineColor});

  --sprite-outline-glow-scale: 0;
  --gss: var(--sprite-outline-glow-scale, var(--dss));
  --glb: var(--sprite-outline-glow-size, calc(var(--gss) * 3em));
  --glc: var(--sprite-outline-glow-color, #fff6);
`}
  filter: opacity(1) drop-shadow(0 var(--dsp) var(--dsb) var(--dsc))
    drop-shadow(var(--dsp) 0 var(--dsb) var(--dsc))
    drop-shadow(0 var(--dsn) var(--dsb) var(--dsc))
    drop-shadow(var(--dsn) 0 var(--dsb) var(--dsc))
    drop-shadow(0 0 var(--glb) var(--glc));

  transition: 140ms filter ease;

  &:hover {
    --dss: 0.14;
    --dsc: rgba(0, 0, 0, 0.6);

    --dsb: 0.6px;
    --glc: rgba(102, 139, 171, 0.6);
    --glb: 16px;

    transition: 140ms filter ease;
  }
`;
