import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import SignUp from "./SignUpModal";
import "../styles/SignIn.css";

const SignIn = ({ setToken }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signin", {
        email,
        password,
      });

      console.log("SignIn response:", response);
      setToken(response.data.token);
      navigate("/list");
    } catch (err) {
      console.error("SignIn error:", err.response ? err.response.data : err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Modal isOpen={true} onClose={() => navigate("/signin")} size="md" isCentered>
      <ModalOverlay />
      <ModalContent className="login-modal">
        <ModalHeader className="login-header">Sign In</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <Text color="red.500" marginBottom="10px">{error}</Text>}

          <form onSubmit={handleSubmit}>
            <FormControl className="login-form-control" isRequired marginBottom="15px">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl className="login-form-control" isRequired marginBottom="25px">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>

            <Button className="login-button" type="submit">
              Sign In
            </Button>
          </form>

          <Text className="signup-link">
            Don't have an account?{" "}
            <Button variant="link" onClick={onOpen}>
              Sign Up
            </Button>
          </Text>
        </ModalBody>
      </ModalContent>

      <SignUp isOpen={isOpen} onClose={onClose} />
    </Modal>
  );
};

export default SignIn;
