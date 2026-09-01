import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  //1.Load the authenticated user
  const { isLoading, isAuthenticated } = useUser();

  //2.If there is no authenticated user, redirect to login
  useEffect(
    function () {
      if (!isLoading && !isAuthenticated) navigate("/login");
    },
    [isLoading, isAuthenticated, navigate],
  );
  //3.Show a spinner while user is loading
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  //4.If there is user, then render the app
  if (isAuthenticated) {
    return children;
  }
}

export default ProtectedRoute;
