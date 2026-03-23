import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../entities/user/model/auth-slice.ts";

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = searchParams.get("token");

  React.useEffect(() => {
    if (token) {
      // Store the token and navigate to profile or home
      // The user data will be fetched automatically by the app (e.g. via baseQueryWithReauth or explicit call)
      dispatch(setCredentials({ accessToken: token }));
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }, [token, dispatch, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <h2>Авторизация...</h2>
      <div className="loader">Пожалуйста, подождите</div>
    </div>
  );
}
