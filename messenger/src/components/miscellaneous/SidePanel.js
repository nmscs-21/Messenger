import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Tooltip,
  Image,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import expressAsyncHandler from "express-async-handler";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";

function SidePanel(props) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const startAIChat = () => {
    setSelectedChat(null);
    navigate("/chats/ai");
  };

  const backToUserMode = () => {
    navigate("/chats");
  };

  const handleSearch = expressAsyncHandler(async () => {
    if (!search) {
      toast({
        title: "Search Feild Empty",
        description: "Enter name or email in the search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });

      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  });

  const createNewChat = expressAsyncHandler(async (userId) => {
    console.log("Entered the createNewChat");
    console.log("recId : ", userId);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      console.log("Data:", data);
      console.log("Chats:", chats);
      setChats([data, ...chats]);
      setSelectedChat(data);
    } catch (error) {
      toast({
        title: "Error Fetching the data",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  });

  const accessChat = (recId) => {
    setLoadingChat(true);
    // console.log("Set the loading to true");

    const existingChat = chats.find((c) => {
      // console.log("Checking chat:", c);
      // console.log("Chat's users:", c.users);
      // console.log("getSender result:", getSender(user, c.users));
      // console.log("Comparison result:", getSender(user, c.users) === recId);
      return (
        c.chatName === "sender" && getSenderFull(user, c.users)._id === recId
      );
    });

    // console.log("existingChat: ", existingChat);
    // console.log("Recievers Id : ", recId);
    // console.log("Chats :");
    // console.log(chats);

    // if (existingChat)
    //   console.log("There is an existing chat and new chat will be created");
    // else console.log("There is no existing chat");

    if (!existingChat) createNewChat(recId);
    else {
      setSelectedChat(existingChat);
    }
    setLoadingChat(false);
    onClose();
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        {/* Normal Component */}
        {!props.ai && (
          <>
            <Tooltip
              label="Search Users to chat"
              hasArrow
              placement="bottom-end"
            >
              <div>
                <Button variant="ghost" onClick={onOpen}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <Text
                    display={{ base: "none", md: "flex" }}
                    px="4"
                    marginY="0.5px"
                  >
                    Search
                  </Text>
                </Button>
              </div>
            </Tooltip>
            <Image
              src="/messenger.png"
              alt="Messenger Logo"
              display="block"
              margin="0 auto"
              textAlign="center"
              // width="auto"
              // height="30px"
              // border="2px solid purple"
              // borderRadius="xl"
            />
            <Button colorScheme="purple" variant="solid" onClick={startAIChat}>
              <Text
                display={{ base: "none", md: "flex" }}
                px="1"
                marginY="0.5px"
              >
                Chat with AI
              </Text>
              <Text
                display={{ base: "flex", md: "none" }}
                px="1"
                marginY="0.5px"
              >
                AI
              </Text>
            </Button>
            <div>
              <Menu>
                <MenuButton p={1}>
                  <NotificationBadge
                    count={notification.length}
                    effect={Effect.SCALE}
                  />
                  <BellIcon fontSize="2xl" m={1}></BellIcon>
                </MenuButton>
                <MenuList pl={2}>
                  {/* {console.log(notification)} */}
                  {!notification.length && "No New Messages"}
                  {notification.map((notif) => (
                    <MenuItem
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((n) => n !== notif)
                        );
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSender(
                            user,
                            notif.chat.users
                          )}`}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </div>
          </>
        )}
        {/* AI component */}
        {props.ai && (
          <>
            <Image
              src="/messengerAI.png"
              alt="Messenger AI Logo"
              display="block"
              margin="0 auto"
              textAlign="center"
              width="auto"
              height="55px"
              // border="2px solid purple"
              // borderRadius="xl"
            />
            <Button
              colorScheme="purple"
              variant="solid"
              onClick={backToUserMode}
            >
              <Text
                px="1"
                marginY="0.5px"
                display={{ base: "none", md: "flex" }}
              >
                User Mode
              </Text>
              <Text
                display={{ base: "flex", md: "none" }}
                px="1"
                marginY="0.5px"
              >
                UM
              </Text>
            </Button>
            <div>
              <Menu>
                <MenuButton p={1}>
                  <NotificationBadge
                    count={notification.length}
                    effect={Effect.SCALE}
                  />
                  <BellIcon fontSize="2xl" m={1}></BellIcon>
                </MenuButton>
                <MenuList pl={2}>
                  {/* {console.log(notification)} */}
                  {!notification.length && "No New Messages"}
                  {notification.map((notif) => (
                    <MenuItem
                      key={notif._id}
                      onClick={() => {
                        toast({
                          title: "Switch to User Mode",
                          description: "Can't access messages from AI mode",
                          status: "error",
                          duration: 5000,
                          isClosable: true,
                          position: "top",
                        });
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSender(
                            user,
                            notif.chat.users
                          )}`}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </div>
          </>
        )}

        <div>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => accessChat(u._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SidePanel;
