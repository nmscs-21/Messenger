import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";

function Scroll({ queries, queryResponses }) {
  const messages = ["...", "Enter a query to start chatting with me"];

  for (let i = 0; i < queries.length; i++) {
    messages.push(queries[i]);
    if (i < queryResponses.length) {
      messages.push(queryResponses[i]);
    }
  }

  //   console.log(messages);

  return (
    <div style={{ height: "558px", overflowY: "auto" }}>
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div key={i} style={{ display: "flex" }}>
              {i % 2 !== 0 && (
                <Tooltip label="ai" placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name="AI bot"
                    src="/aiBot.jpg"
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${i % 2 === 0 ? "#9962CC" : "#B596FF"}`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: i % 2 === 0 ? "auto" : "0",
                  marginTop: 10,
                }}
              >
                {m}
              </span>
            </div>
          ))}
      </ScrollableFeed>
    </div>
  );
}

export default Scroll;
