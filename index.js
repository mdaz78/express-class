const { users: patients } = require("./data/index");
const express = require("express");
const port = 3001;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const user = JSON.parse(req.query.user);

  const patient = patients.find((patient) => patient.name === user);

  console.log({ user, patient, patients });

  if (!patient) {
    return res.status(404).send("User not found");
  }

  const { healthyKidneys, unhealthyKidneys, numberOfKidneys } =
    patient.kidneys.reduce(
      (obj, k) => {
        if (k.healthy) {
          obj.healthyKidneys += 1;
        } else {
          obj.unhealthyKidneys += 1;
        }

        obj.numberOfKidneys += 1;

        return obj;
      },
      { healthyKidneys: 0, unhealthyKidneys: 0, numberOfKidneys: 0 }
    );

  res.json({
    healthyKidneys,
    unhealthyKidneys,
    numberOfKidneys,
  });
});

app.post("/", (req, res) => {
  const body = req.body;

  console.log({ patients });

  if (!body.user || !body.isHealthy) {
    return res.status(400).send("Bad Request");
  }

  const user = patients.find((p) => p.name === body.user);

  if (!user) {
    patients.push({
      name: body.user,
      kidneys: [
        {
          healthy: body.isHealthy,
        },
      ],
    });

    return res.status(201).json({
      message: "Successfully added patient",
    });
  }

  user.kidneys.push({
    healthy: body.isHealthy,
  });

  console.log({ patients });

  res.status(201).json({
    message: `Successfully added kidney for ${body.user}`,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
