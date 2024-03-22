require("dotenv").config();
const express = require("express");
const Eureka = require("eureka-js-client").Eureka;
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Eureka client configuration
const client = new Eureka({
  instance: {
    app: "service2",
    hostName: "3.108.184.28",
    ipAddr: "3.108.184.28",
    port: {
      $: 5001,
      "@enabled": "true",
    },
    vipAddress: "service2",
    statusPageUrl: "http://3.108.184.28:5001",
    healthCheckUrl: "http://3.108.184.28:5001/health",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    host: "3.108.184.28",
    port: 8761,
    servicePath: "/eureka/apps/",
  },
});

client.start();

client.on("error", (error) => {
  console.error("Error with Eureka client", error);
});

app.get("/", (req, res) => {
  res.send("<h1>Service 2 is connected with NodeDev!!!</h1>");
});

app.get("/health", (req, res) => {
  res.status(200).send({
    error: false,
    msg: "OK",
  });
});

app.get("/fetch-data", async (req, res) => {
  try {
    const instances = client.getInstancesByAppId("nodedev");
    const instance = instances[0];
    const url = `http://${instance.hostName}:${instance.port.$}/api/products`;
    console.log(`URL: ${url}`);
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(
    `Server connected in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
