const svix = require("svix");
const Webhook = svix.Webhook;
const axios = require("axios");
const secret = process.env.WEBHOOK_SECRET;

const handleWebhook = async (req, res) => {
  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(secret);
  let msg;
  try {
    msg = wh.verify(payload, headers);
  } catch (err) {
    return res.status(400).json({});
  }

  switch (msg.type) {
    case "user.created":
      try {
        await axios.post("http://localhost:4000/api/users", msg);
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({});
      }
      break;
    default:
      break;
  }

  res.json({});
};

module.exports = handleWebhook;
