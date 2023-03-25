import { ChangeEvent, FC, MouseEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { ILoginForm, loginUser } from "../../reducers/auth";
import { useNavigate } from "react-router-dom";
import posthog from "posthog-js";
import laudspeakerLogo from "../../assets/images/laudspeaker.svg";
import CustomLink from "components/Link/Link";
import Tooltip from "components/Elements/Tooltip";
import githubIcon from "../../assets/images/github.svg";
import googleIcon from "../../assets/images/google.svg";
import gitlabIcon from "../../assets/images/gitlab.svg";
import { Link } from "react-router-dom";

export interface LoginProps {
  setShowWelcomeBanner: (value: boolean) => void;
}

const Login: FC<LoginProps> = ({ setShowWelcomeBanner }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginForm, setLoginForm] = useState<ILoginForm>({
    email: "",
    password: "",
  });

  const handleLoginFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await dispatch(loginUser(loginForm));
    if (response?.data?.access_token) {
      posthog.capture("LogInProps", {
        $set: {
          email: loginForm.email,
          laudspeakerId: response.data.id,
        },
      });

      if (!response?.data?.verified && !localStorage.getItem("dontShowAgain")) {
        setShowWelcomeBanner(true);
      }

      navigate("/");
    }
  };

  return (
    <>
     
    </>
  );
};

export default Login;
