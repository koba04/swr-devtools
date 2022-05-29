// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

let counter = 1;

export default (req, res) => {
  ++counter;
  if (req.query.error) {
    setTimeout(() => {
      res.status(500).json({ message: "this is an error message" });
    }, 1000);
  } else {
    res.status(200).json({ name: `Hello World ${counter}` });
  }
};
