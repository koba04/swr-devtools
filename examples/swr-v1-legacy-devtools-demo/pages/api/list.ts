// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const pages = {
  1: [
    {
      name: "Array.prototype.at()",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at",
    },
    {
      name: "Array.prototype.concat()",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat",
    },
    {
      name: "Array.prototype.copyWithin()",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin",
    },
    {
      name: "Array.prototype.entries()",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries",
    },
    {
      name: "Array.prototype.every()",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every",
    },
  ],
  2: [
    {
      name: "HTMLElement.accessKey",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/accessKey",
    },
    {
      name: "HTMLElement.contentEditable",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/contentEditable",
    },
    {
      name: "HTMLElement.inert",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert",
    },
    {
      name: "HTMLElement.nonce",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/nonce",
    },
    {
      name: "HTMLElement.tabIndex",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex",
    },
  ],
  3: [
    {
      name: "animation",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation",
    },
    {
      name: "background",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/background",
    },
    {
      name: "border",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/border",
    },
    {
      name: "display",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/display",
    },
    {
      name: "env()",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/env()",
    },
  ],
};

export default (req, res) => {
  setTimeout(() => {
    res.status(200).json(pages[req.query.page] || null);
  }, 1000);
};
