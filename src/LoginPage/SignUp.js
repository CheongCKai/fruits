import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, setDoc, doc } from "../Backend/Firebase/firebase"; 
import { TitleLogin, LoginContainer, FormLogin, LoginInput, ButtonLogin, LinkLogin } from './LoginPageStyle';  
import PasswordToggle from "../Components/PasswordToggle";

const Signup = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputName, setInputName] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputEmail,
        inputPassword
      );
      const uid = userCredential.user.uid;
      // Store user data in Firestore
      await setDoc(doc(db, "users", uid), {
        email: inputEmail,
        name: inputName,
        type: "customer", // Default type for signup
      });
      alert("Account created successfully!");
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(`Error signing up: ${error.message}`);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <LoginContainer>
      <TitleLogin>Sign Up</TitleLogin>
      <FormLogin>
      <label>
          Name:
          <LoginInput
            type="text"
            value={inputName}
            placeholder="UserName"
            onChange={(e) => setInputName(e.target.value)}
          />
        </label>
        <label>
          Email:
          <LoginInput
            type="email"
            value={inputEmail}
            placeholder="Valid Email"
            onChange={(e) => setInputEmail(e.target.value)}
          />
        </label>
        <label style={{ position: 'relative' }}>  {/* Added relative positioning to this label */}
          Password:
          <LoginInput
            type={passwordVisible ? "text" : "password"}
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            style={{ paddingRight: '30px' }}
          />
          <PasswordToggle
          passwordVisible={passwordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
          />

        </label>
        <ButtonLogin type="button" onClick={handleSignup}>
          Sign Up
        </ButtonLogin>
      </FormLogin>
      <p>
        Already have an account? <LinkLogin href="/">Login here</LinkLogin>.
      </p>
    </LoginContainer>
  );
};

export default Signup;
