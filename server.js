const express = require("express");
const fs = require("fs");
const path = require("path")

const { createServer, writeToFile, getFromFile, hashSHA512 } = require("./networkingEngine");

const PORT = 8080;

const app = createServer(PORT, "ipLog.log", "blockedIps.json", "/etc/letsencrypt/live/flameys.net", "public");