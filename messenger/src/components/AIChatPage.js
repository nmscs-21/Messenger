import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import SidePanel from "./miscellaneous/SidePanel";
import ChatBox from "./ChatBox";
import ChatList from "./ChatList";
import { useState } from "react";

function AIChatPage() {
  const { user } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SidePanel ai={true} />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <ChatList fetchAgain={fetchAgain} ai={true} />}
        {user && (
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            ai={true}
          />
        )}
      </Box>
    </div>
  );
}

export default AIChatPage;
