import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import expressAsyncHandler from "express-async-handler";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = (e) => setShow(!show);

  const postDetails = (pics) => {
    console.log("postDetails called with:", pics);
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        description: "Image has not been selected",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "messenger");
      data.append("cloud_name", "dwwunccsb");
      fetch("https://api.cloudinary.com/v1_1/dwwunccsb/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        description: "Image has not been selected",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
  };

  const handleSubmit = expressAsyncHandler(async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the feilds",
        description: "All feilds haven't been filled.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        description: "Passwords Do Not Match.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "api/user",
        { name, email, password, ...(pic && { pic }) },

        config
      );

      toast({
        title: "Registration Successful",
        description: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  });

  return (
    <VStack spacing="5px" color="black" as="form" onSubmit={handleSubmit}>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            // value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            // value={password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          onChange={(e) => {
            console.log("File selected:", e.target.files[0]);
            postDetails(e.target.files[0]);
          }}
          accept="image/*" // Allowing only image files
        />
      </FormControl>

      <Button
        type="submit"
        colorScheme="purple"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default SignUp;
