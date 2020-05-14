const APIURL = "";
const axios = require("axios");
// import { userService } from '../_services';
import {authHeader } from '../_helpers';

var entry = {
  "blocks":
  {
    "lt_id": "exampleid",
    "title": "title",
    "start": "start",
    "end": "end",
    "uids": "user"
  },
  "events":
  {
    "id": "exampleid",
    "title": "title",
    "start": "start",
    "end": "end",
    "uid": "user",
    //"lists": ["listid1","listid2"],
    "recurring": "NA"
  },
  "lists":
  {
    "name": "NA",
    "color": "#ffffff",
    "tasks": ["Final CS461 Deliverable"],
    "list_id": "exampleID",
    "shared_users": ["charlie","murphy"],
    "uids": "user_id1"
  },
  "tasks":
  {
    "name": "Final CS461 Deliverable",
    "due": {"date": "2019-23-19", "time": "T13:34:00.000"},
    "est": 3000,
    //"alg": 4500, //dont store in dB but just store user specified data
    //"aid": "exampleAID",
    "uids": "1",
    "lists": ["listid1"],
    "recurring": "NA"
  },
  "users":
  {
    "first_name": "root",
    "last_name": "user",
    "email": "root@timeshift.com",
    "uid": "1",
    "listPositions": ["1"]
  }
}

export const requestsMixin = {
  methods: {
    getCalendar() {
      //console.log("getCalendar(): ");
      return axios.get(`${APIURL}/entries`, {
        //send jwt header to make CRUD ops
        headers: authHeader()
      });
    },
    addCalendar(data) {
      //when posting to calendar, can include all endpoints here
      //instead of posting data (the 5 variables used by the calendar), post the who request body
      let { start, end, title, est } = data;
      //replace event values
      entry.events.title = title;
      entry.events.start = start;
      entry.events.end = end;
      //replace block values
      entry.blocks.title = title;
      entry.blocks.start = start;
      entry.blocks.end = end;
      //replace task values
      // "name": "Final CS461 Deliverable",
      // "due": {"date": "2019-23-19", "time": "T13:34:00.000"},
      // "est": 3000,
      entry.tasks.name = title;
      entry.tasks.est = est;
      // TODO //parse out date from time
      // entry.tasks.due.date = due_date;
      // entry.tasks.due.time = due_time;
      // entry.tasks.est =

      return axios.post(`${APIURL}/entries`, entry, {
        //send jwt header to make CRUD ops
        headers: authHeader()
      });
    },
    editCalendar(data) {
      //console.log("editCalendar(data): data = ");
      //console.log(data);
      let { start, end, title, id} = data;
      //replace event values
      entry.events.title = title;
      entry.events.start = start;
      entry.events.end = end;
      //replace block values
      entry.blocks.title = title;
      entry.blocks.start = start;
      entry.blocks.end = end;
      entry.id = id;
      return axios.put(`${APIURL}/entries/${entry.id}`, entry, {
        //send jwt header to make CRUD ops
        headers: authHeader()
      });
    },
    deleteCalendar(id) {
      return axios.delete(`${APIURL}/entries/${id}`, {
        //send jwt header to make CRUD ops
        headers: authHeader()
      });
    }
  }
};
