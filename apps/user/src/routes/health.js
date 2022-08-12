import { ExpressApplicationRouter } from "@rafat97/express-made-easy";

const healthRoutes = new ExpressApplicationRouter();

healthRoutes.getMethod("/", (req, res) => {
  res.status(200).send({ message: "up" });
});

export { healthRoutes };
