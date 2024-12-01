import React, { useState } from "react";
import axios from "axios";
import { Button, Input, FormControl, FormLabel, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import "../styles/SignUpModal.css";

const SignUp = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      alert("Sign Up successful!");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="signup-modal-header">Sign Up</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <Text className="signup-error">{error}</Text>}

          <form onSubmit={handleSubmit}>
            <FormControl isRequired className="signup-form-control">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="signup-input"
              />
            </FormControl>

            <FormControl isRequired className="signup-form-control">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="signup-input"
              />
            </FormControl>

            <FormControl isRequired className="signup-form-control">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="signup-input"
              />
            </FormControl>

            <Button className="signup-submit-btn" type="submit">
              Sign Up
            </Button>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button className="signup-close-btn" variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignUp;
