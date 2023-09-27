const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newQuery = req.body.query;

    const options = {
      method: "POST",
      url: "https://chatgpt-api8.p.rapidapi.com/",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY1,
        "X-RapidAPI-Host": "chatgpt-api8.p.rapidapi.com",
      },
      data: [
        {
          content: newQuery,
          role: "user",
        },
      ],
    };

    const { data } = await axios.request(options);

    res.json(data);
  } catch (error) {
    try {
      const newQuery = req.body.query;

      const options = {
        method: "POST",
        url: "https://chatgpt-api8.p.rapidapi.com/",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY2,
          "X-RapidAPI-Host": "chatgpt-api8.p.rapidapi.com",
        },
        data: [
          {
            content: newQuery,
            role: "user",
          },
        ],
      };

      const { data } = await axios.request(options);

      res.json(data);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

module.exports = router;
