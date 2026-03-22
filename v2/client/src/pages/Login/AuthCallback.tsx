import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyToken } from "../../entities/user/model/auth-slice.ts";
import type { AppDispatch } from "../../app/store.ts";

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const token = searchParams.get("token");

  React.useEffect(() => {
    if (token) {
      dispatch(verifyToken(token)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          navigate("/");
        }
      });
    }
  }, [token, dispatch, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <h2>Проверка ссылки...</h2>
      <div className="loader">Пожалуйста, подождите</div>
    </div>
  );
}
