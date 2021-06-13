const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

const bot = new Telegraf(process.env.TG_API_KEY);

const trans = async (V) => {
  const M = await axios.get(
    `https://antonymonline.ru/antonyms.json?word=${encodeURIComponent(V)}`
  );
  M.data.status === "ok" ? (V = M.data.antonyms[0]) : (V = "🤔");
  return V;
};

const getData = (B) => {
  let a = [];
  for (let i = 0; i < B.length; i++) {
    a.push(trans(B[i]));
  }
  return a;
};

bot.on("inline_query", (ctx) => {
  Promise.all(
    getData(ctx.inlineQuery.query.split` `.filter((x) => x.length >= 1))
  )
    .then((z) => {
      ctx
        .answerInlineQuery([
          {
            type: "article",
            id: "someID",
            title: z.join` `,

            message_text: "Test",
          },
        ])
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// TODO: Module 2 proxy
// const HTMLParser = require("node-html-parser");
// .map((y) => {
//   axios.get(`https://sinonim.org/a/${encodeURIComponent(y)}`).then((r) => {
//     root.querySelector("#skolko").toString().split` `[2] - количество антонимов
//     let root = HTMLParser.parse(r.data);
//     try {
//       rez.push(root.querySelector("#strokoy").toString().split` `[0]);
//     } catch (error) {
//       rez.push("#");
//     }
//   });
// });
