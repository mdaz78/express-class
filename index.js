const { users: patients } = require("./data/index");
const express = require("express");
const port = 3001;

const app = express();

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
