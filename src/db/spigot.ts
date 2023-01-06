import mongoose from "mongoose";
import connection from "./connect.js";
import { Router } from "express";
export const app = Router();

// Type to represent the spigot model
export type spigotSchema = {
  version: string,
  date: Date,
  latest: boolean,
  url: string
};

export const spigot = connection.model<spigotSchema>("spigot", new mongoose.Schema<spigotSchema>({
  version: {
    type: String,
    required: true,
    unique: true
  },
  date: Date,
  latest: Boolean,
  url: String
}));

app.get("/", ({res}) => spigot.find().lean().then(data => res.json(data)));
app.get("/latest", async ({res}) => res.json(await spigot.findOne({latest: true}).lean() ?? await spigot.findOne().sort({date: -1}).lean()));
app.get("/search", async (req, res) => {
  let version = req.query.version as string;
  if (!version) return res.status(400).json({error: "No version specified"});
  const versionFinded = await spigot.findOne({version}).lean();
  if (!versionFinded) return res.status(404).json({error: "Version not found"});
  return res.json(versionFinded);
});
