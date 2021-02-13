// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


let counter = 1;

export default (req, res) => {
  ++counter;
  res.status(200).json({ name: `Hello World ${counter}`})
}
