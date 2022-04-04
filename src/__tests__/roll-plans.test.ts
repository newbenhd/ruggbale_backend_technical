// import axios from 'axios'
// import {resetDb, insertTestUser} from 'utils/db-utils'
// import {getData, handleRequestFailure, resolve} from 'utils/async'
// import * as generate from 'utils/generate'
// import * as booksDB from '../db/books'
import "../config/config";
import request from "supertest";
import cases from "jest-in-case";
import { AddressInfo, Server } from "net";
import startServer from "../start";

let baseURL: string;
let server: Server;

beforeAll(async () => {
  server = await startServer({
    port: "3000",
  });
  const address = server.address() as AddressInfo;
  baseURL = `http://localhost:${address.port}/api/`;
});

afterAll(() => server.close());

function casify(obj: { [key: string]: any }) {
  return Object.entries(obj).map(([name, { url, ...others }]) => ({
    name,
    ...others,
  }));
}

cases(
  "roll-plans route: handled good url",
  async ({ name: url, status }) => {
    const { text, status: resStatus } = await request(baseURL).get(url);
    // console.log(text);
    const data = JSON.parse(text);
    expect(resStatus).toBe(status);
    expect(data).toHaveProperty("length");
    expect(data).toHaveProperty("roll_id");
    expect(data).toHaveProperty("plan");
    expect(data.plan).toBeInstanceOf(Array);
  },
  casify({
    "roll/next?roll_length=30": {
      status: 200,
    },
    "roll/next?roll_length=0": {
      status: 200,
    },
    "roll/next?roll_length=7": {
      status: 200,
    },
    "roll/next?roll_length=14": {
      status: 200,
    },
    "roll/next?roll_length=15&include_rush=false": {
      status: 200,
    },
    "roll/next?roll_length=15&include_rush=true": {
      status: 200,
    },
    "roll/next?include_rush=true&roll_length=15": {
      status: 200,
    },
    "roll/next?roll_length=15&asdfjklasjkdjf": {
      status: 200,
    },
  })
);

cases(
  "roll-plans route: handled bad url",
  async ({ name: url, status, messages }) => {
    const { text, status: resStatus } = await request(baseURL).get(url);
    // console.log(text);
    const data = JSON.parse(text);
    expect(resStatus).toBe(status);
    expect(data).toHaveProperty("errors");
    expect(data.errors).toBeInstanceOf(Array);
    expect(data.errors.length).toBeGreaterThan(0);
    const errorMessages = data.errors.map((error: any) => error.msg);
    expect(errorMessages).toEqual(messages);
  },
  casify({
    "roll/next": {
      status: 404,
      messages: ["roll_length not provided"],
    },
    "roll/next?roll_length=abc": {
      status: 404,
      messages: ["roll_length should be number"],
    },
    "roll/next?roll_length": {
      status: 404,
      messages: ["roll_length should not be empty"],
    },
    "roll/next?roll_length=100abc": {
      status: 404,
      messages: ["roll_length should be number"],
    },
    "roll/next?roll_length=13&include_rush": {
      status: 404,
      messages: ["include_rush should not be empty"],
    },
    "roll/next?include_rush=true": {
      status: 404,
      messages: ["roll_length not provided"],
    },
    "roll/next?roll_length=": {
      status: 404,
      messages: ["roll_length should not be empty"],
    },
    "roll/next?roll_length=10&include_rush=": {
      status: 404,
      messages: ["include_rush should not be empty"],
    },
    "roll/next?roll_length=-10": {
      status: 404,
      messages: ["roll_length should be greater than or equal to 0"],
    },
    "roll/next?roll": {
      status: 404,
      messages: ["roll_length not provided"],
    },
  })
);
