export const CHAT_FRIENDS: Message[][] = [
   [
      {
         dir: 0,
         type: 1,
         text: "Hey! How's it going?",
         name: "",
         size: "",
         extension: "",
         isImg: true,
         buttons: [],
      },
      {
         dir: 0,
         type: 1,
         text: "I'm working on a new project.",
         name: "",
         size: "",
         extension: "",
         isImg: true,
         buttons: [],
      },
   ],
   [
      {
         dir: 1,
         type: 2,
         text: "I'm good! Just got back from a 15km run in the mountains.",
         name: "Rocky Mountains",
         size: "1.4",
         extension: ".JPG",
         isImg: true,
         buttons: [],
      },
      {
         dir: 1,
         type: 1,
         text: "Doing some work on the side",
         name: "",
         size: "",
         extension: "",
         isImg: true,
         buttons: [],
      },
   ],
   [
      {
         dir: 0,
         type: 1,
         text: "Only a couple of miles, nothing crazy.",
         name: "",
         size: "",
         extension: "",
         isImg: true,
         buttons: [],
      },
   ],
   [
      {
         dir: 1,
         type: 1,
         text: "Thanks! So, anything new?",
         name: "",
         size: "",
         extension: "",
         isImg: true,
         buttons: [],
      },
   ],
   [
      {
         dir: 0,
         type: 1,
         text: "Actually, I have some news! I got a new job.",
         name: "",
         size: "",
         extension: "",
         isImg: true,
         buttons: [],
      },
   ],
   [
      {
         dir: 1,
         type: 1,
         text: "Congrats! What's the role?",
         name: "",
         size: "",
         extension: "",
         isImg: true,
         buttons: [],
      },
   ],
   [
      {
         dir: 0,
         type: 1,
         text: "Thanks! It's in marketing.",
         name: "",
         size: "",
         extension: "",
         isImg: true,
         buttons: [],
      },
   ],
]
export const CHAT_BOT: Message[][] = [
   [
      {
         dir: 1,
         type: 1,
         text: `Hello! Start`,
         name: "",
         size: "",
         extension: "",
         isImg: true,
         buttons: [],
      },
   ],
   [
      {
         dir: 0,
         type: 2,
         text: `Welcome to our store!
We’re so glad to have you here. 😊

Here’s how we can assist you today:

1. Track Your Order – Easily check the status of your recent purchase.
2. Browse Products – Discover our range of categories, from electronics to home goods.
3. Talk to Support – Need help? We’re here to assist you with any queries.

Choose one of the options below, or type your question to get started!
         `,
         name: "",
         size: "",
         extension: "",
         isImg: true,
         buttons: [
            [{ id: 1, text: "🧾 Track my order", hasRef: false }],
            [{ id: 1, text: "🔎 Browse products", hasRef: false }],
            [{ id: 1, text: "📣 Talk to support", hasRef: false }],
         ],
      },
   ],
]

export const REPLY_FRIEND: Message = {
   dir: 1,
   type: 1,
   text: "Marketing sounds exciting! Are you working with a big team?",
   name: "File_Name",
   size: "1.4",
   extension: ".PNG",
   isImg: true,
   buttons: [],
}

export const REPLY_BOT: Message = {
   dir: 1,
   type: 1,
   text: " I’d like to know about any special offers or updates you have! What’s new and exciting?",
   name: "File_Name",
   size: "1.4",
   extension: ".PNG",
   isImg: true,
   buttons: [],
}

/** default */
export const EDITOR_STATE: Message = { dir: 0, type: 1, text: "Sample Text", name: "File_Name", size: "1.4", extension: ".PNG", isImg: true, buttons: [] }
