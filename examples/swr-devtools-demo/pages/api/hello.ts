// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

let counter = 1;

export default async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

  ++counter;
  if (req.query.error) {
    res.status(500).json({ message: "this is an error message" });
  } else {
    res.status(200).json({ name: `Hello World ${counter}` });
  }
};
