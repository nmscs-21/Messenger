import React from "react";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

function ChatBox({ fetchAgain, setFetchAgain, ai }) {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{
        base: ai ? "flex" : selectedChat ? "flex" : "none",
        md: ai ? "flex" : "flex",
      }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      justifyContent={ai ? "center" : "flex-start"}
      borderRadius="lg"
      borderWidth="1px"
      marginX={ai ? "auto" : "0"} // Center the box horizontally if ai is true
    >
      <SingleChat
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        ai={ai}
      />
    </Box>
  );
}

export default ChatBox;
