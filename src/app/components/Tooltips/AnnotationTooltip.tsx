import styled from 'styled-components';
import { TooltipBase } from './TooltipBase';
import { isNotNullOrUndefined } from '../../util';
import { translate } from '../../util/i18n';
import { useHideTooltips } from './useHideTooltips';

const StyledTooltipBase = styled(TooltipBase)``;

const AnnotationTooltipContainer = styled.div``;

const Title = styled.div``;

const Description = styled.div``;

const Example = styled.div``;

const annotationTooltipDefinition = [
  [
    'DontDrawAnnotation',
    {
      title: 'Do Not Draw',
      desc: 'When this flag is set, spell actions that would usually draw another spell are prevented from doing so.',
    },
  ],
  [
    'ProjectileCountAnnotation',
    {
      title: 'Projectile Count',
      desc: 'Multiple projectiles of the same type are shown grouped together.',
    },
  ],
] as const;

export type AnnotationTooltipId =
  (typeof annotationTooltipDefinition)[number][0];

type AnnotationTooltipDef = {
  title: string;
  desc: string;
};

const annotationToopltipMap = new Map<
  AnnotationTooltipId,
  AnnotationTooltipDef
>(annotationTooltipDefinition);

export const isAnnotationTooltipId = (x: string): x is AnnotationTooltipId =>
  annotationToopltipMap.has(x);

export const getAnnotationTooltip = (
  annotationTooltipId: AnnotationTooltipId,
) => ({
  ...annotationToopltipMap.get(annotationTooltipId),
  example: <Example></Example>,
});

export const AnnotationTooltip = ({
  className = '',
}: {
  className?: string;
}) => {
  const [hidden, tooltipRef] = useHideTooltips();

  return (
    <StyledTooltipBase
      className={className}
      id={'tooltip-spellinfo'}
      data-name={'SpellInfoTooltip'}
      hidden={hidden}
      ref={tooltipRef}
      disableStyleInjection={true}
      offset={10}
      closeEvents={{
        mouseleave: true,
        blur: true,
        click: true,
      }}
      globalCloseEvents={{
        scroll: true,
        resize: true,
      }}
      render={({ content }) => {
        if (!isNotNullOrUndefined(content) || !isAnnotationTooltipId(content)) {
          return null;
        }
        const { title, example, desc } = getAnnotationTooltip(content);
        return (
          <AnnotationTooltipContainer>
            <Title>{title}</Title>
            {example}
            <Description>{desc}</Description>
          </AnnotationTooltipContainer>
        );
      }}
    />
  );
};
