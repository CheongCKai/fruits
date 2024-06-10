import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, doc, getDoc } from "../Backend/Firebase/firebase";
import { LoginContainer, FormLogin, LoginInput, ButtonLogin, LinkLogin, TitleLogin, SignInErrorText } from './LoginPageStyle';  
import PasswordToggle from "../Components/PasswordToggle";

const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        inputEmail,
        inputPassword
      );

      const uid = userCredential.user.uid;
      // Fetch user data from Firestore based on uid
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userType = userData.type;
        if (userType === "admin") {
          localStorage.setItem('userName', userData.name);
          navigate("/owner", { replace: true });
        } else {
          localStorage.setItem('userName', userData.name);
          navigate("/customer", { replace: true });
        }
      } else {
        console.log("User data not found.");
      }
    } catch (error) {
      console.error("Error signing in:", error.message);
      // window.alert("Incorrect username or password.");
      setErrorMessage("Incorrect Username or Password.")
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  return (
    <LoginContainer>
      <TitleLogin>Login</TitleLogin>
      <FormLogin>
        <label>
          Email:
          <LoginInput
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
          />
        </label>
        <label style={{ position: 'relative' }}>
          Password:
          <LoginInput
             type={passwordVisible ? "text" : "password"}
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
          />
          <PasswordToggle
          passwordVisible={passwordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
          />
        </label>
        {errorMessage && <SignInErrorText>{errorMessage}</SignInErrorText>}

        <ButtonLogin type="button" onClick={handleLogin}>
          Login
        </ButtonLogin>
      </FormLogin>
      <p>
        Don't have an account? <LinkLogin href="/SignUp">Sign up here</LinkLogin>.
      </p>
    </LoginContainer>
  );
};

export default Login;
