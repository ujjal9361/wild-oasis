import styled, { css } from "styled-components";

const Row = styled.div`
  display: flex;

  ${(props) =>
    (props.type === "horizontal" || props.type === undefined) &&
    css`
      justify-content: space-between;
      align-items: center;
    `}
  ${(props) =>
    props.type === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`;

export default Row;
