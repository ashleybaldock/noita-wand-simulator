import styled from 'styled-components';
import { EditableWrapper } from './EditableWrapper';

export const EditableWithLabel = styled(EditableWrapper).attrs((props) => ({
  label: true,
  dataName: props.dataName ?? 'EditableWithLabel',
}))``;
