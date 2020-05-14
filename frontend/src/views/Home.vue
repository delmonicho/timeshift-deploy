<!-- This template page is the container for the calendar -->
<!-- The home page component is displayed after signing in to the application,
it shows the signed in user's name plus a list of all users in the tutorial app.
The users are loaded into the vuex state by calling this.getAllUsers(); from the
created() vue lifecycle hook, the getAllUsers() method is mapped to the vuex
action 'users/getAll' with the help of the vuex mapActions() function -->
<template>
  <div class="page">
    <div class="titles" style="text-align: center">
      <h1>timeShift</h1>
      <h3>Scheduling Optimization at its finest</h3>
    </div>
    <!-- Login/Welcome -->
    <div class="container" style="margin-top: 30px">
        <h2>Aloha {{account.user.firstName}}!</h2>
        <h6>Begin optimizing your schedule by entering tasks below!!</h6>
        <!-- <h3>Users from secure api end point:</h3>
        <em v-if="users.loading">Loading users...</em>
        <span v-if="users.error" class="text-danger">ERROR: {{users.error}}</span> -->
        <!-- <ul v-if="users.items">
            <li v-for="user in users.items" :key="user.id">
                {{user.firstName + ' ' + user.lastName}}
                <span v-if="user.deleting"><em> - Deleting...</em></span>
                <span v-else-if="user.deleteError" class="text-danger"> - ERROR: {{user.deleteError}}</span>
                <span v-else> - <a @click="deleteUser(user.id)" class="text-danger">Delete</a></span>
            </li>
        </ul> -->
        <p>
            <router-link to="/login">Logout</router-link>
        </p>
    </div>
    <!-- Task Creation and List -->
    <div style="width: 100%;  padding: 80px 20px 40px 40px; text-align: center;">
          <div class="row">
            <!-- CREATE TASK INPUT FORMS  -->
              <div class="col-md-6">
                  <div class="well">
                      <h2>Create a New Task</h2>
                      <form>
                          <div class="form-group">
                              <label for="todoitem">Task Item</label>
                              <input type="text" v-model="input" class="form-control" id="todoitem" placeholder="enter task" />
                              <input type="text" v-model.number="hours" class="form-control" id="todohours" placeholder="enter hours to complete task" onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13 || event.charCode == 46) ? null : event.charCode >= 48 && event.charCode <= 57"/>
                          </div>
                          <b-button type="button" v-on:click="add()" class="btn btn-default" >Create</b-button>
                      </form>
                  </div>
              </div>
              <!-- TASKS LIST -->
              <div class="col-md-6">
                  <h2>Tasks List</h2>
                  <ul class="list-group">
                      <li v-for="(todo, index) in todos" :key="index" class="list-group-item">
                          {{ todo[0] }} - {{ todo[1] }} hours
                      </li>
                  </ul>
                  <b-button type="button" v-on:click="remove()" v-bind:disabled="isButtonDisabled">Optimize Calendar</b-button>
                  <div class="row" style="padding:10px 40px 60px 155px;">
                    <b-button type="button" v-on:click="accept()" v-bind:disabled="approvalReq">Accept</b-button>
                    <b-button type="button" v-on:click="decline()" v-bind:disabled="approvalReq">Decline</b-button>
                  </div>
              </div>
          </div>
    </div>
    <div style="width: 100%; padding: 0px 20px 40px 40px; text-align:center;">
      <!-- ADD CALENDAR EVENT BUTTON -->
      <div class="buttons">
        <b-button v-b-modal.add-modal>Add Calendar Event</b-button>
      </div>
      <!-- FULL CALENDAR COMPONENT -->
      <full-calendar :events="events" @event-selected="openEditModal" :nowIndicator="true" defaultView="agendaWeek" />
        <b-modal id="add-modal" title="Add Calendar Event" hide-footer ref="add-modal">
          <CalendarForm :edit="false" @eventSaved="closeModal()" ref="add-event"/>
        </b-modal>
        <b-modal id="edit-modal" title="Edit Calendar Event" hide-footer ref="edit-modal">
          <CalendarForm :edit="true" :calendarEvent="calendarEvent" @eventSaved="closeModal()" />
        </b-modal>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import CalendarForm from "@/components/CalendarForm.vue";
import { requestsMixin } from "../mixins/requestsMixin";
import { mapState, mapActions } from 'vuex';
// import { userService } from '../_services';
import * as moment from "moment";
var currentDate = new Date();
export default {
  name: "home",
  components: {
    CalendarForm
  },
  mixins: [requestsMixin],
  computed: {
    ...mapState({
        account: state => state.account,
        users: state => state.users.all
    }),
    events() {
      return this.$store.state.events;
    },
    tasks() {
      return this.$store.state.tasks;
    }
  },
  created() {
    this.getAllUsers();
  },
  data() {
    return {
      calendarEvent: {},      //controls data for calendar forms
      todos: [],              //controls todos task list
      tempTodos: [],          //holds todos for redistribution
      //algTodosTimes: [],      //holds todos title,start time,end time to display to user
      input: '',              //string for task title input form
      hours:'',               //number for task estimated hours of completion
      taskTimes:'',           //string to hold dateTime
      isButtonDisabled:false, //bool to check if input forms in process of editing
      approvalReq:true,
      consent:true            //bool to check if user satisfied with task filling
    };
  },
  async beforeMount() {
    // TODO
    //use authHeader and func handleResponse from user.service to get Bearer jwt token to get events
    await this.getEvents();
  },
  methods: {
    ...mapActions('users', {
      getAllUsers: 'getAll',
      deleteUser: 'delete'
    }),
    async getEvents() {
      const response = await this.getCalendar();
      //Vuex store is expecting events to look like original tutorial version
      // so the response.data before would look like

      //res_data is the reformatted json body to store calendar array of events for Vuex store
      const res_data = [];
      //parse through response.data to save start,end,title, and id in a calendar array
      //for each observation in response.data
      //console.log("response.data: " + response.data);
      var obs;
      for (obs in response.data) {
        //console.log(response.data[obs].blocks.start);
        res_data[obs] = {
          "start": response.data[obs].events.start,
          "end": response.data[obs].events.end,
          "title": response.data[obs].events.title,
          "id": response.data[obs]._id
        }
      }
      this.$store.commit("setEvents", res_data);
      //console.log("getEvents(): " + res_data);
      //disable 'fill calendar' button if task list empty
      if(this.todos.length == 0) {
        this.isButtonDisabled = true;
      }
      //alert("Welcome to timeShift, the premier calendar app that helps you optimally plan your schedule and fulfill your tasks.  To begin, please create tasks with a title and estimated hours to complete on the left.  Once you have input your tasks, simply click 'Fill Calendar' to place the tasks in the available spaces in your calendar.")
    },
    async getAlgTimes ()
    {
      const response = await this.getCalendar();
      //calc_data is the reformatted json body to store calendar array of events for Vuex store
      let calc_data = [];
      var obs, obs_start, obs_end, obs_title, obs_id, time_diff, tempInput, tempHours;
      //get tempInput and tempHours to compare and find tasks just added
      for (var t=0; t < this.tempTodos.length; t++)
      {
        tempInput = this.tempTodos[t][0];
        tempHours = this.tempTodos[t][1];
        //console.log(tempInput,tempHours);
        for (obs in response.data) {
          obs_start = response.data[obs].events.start;
          obs_end = response.data[obs].events.end;
          obs_title = response.data[obs].events.title;
          obs_id = response.data[obs]._id;
          //parse start and end time to calc time_diff in float hours
          //console.log(obs_start + obs_end);
          //if this.tempTodos[0] = response.data[obs].events.title && (response.data[obs].events.end - response.data[obs].events.start) - this.tempTodos[1] < 0.1
          if (tempInput == obs_title)
          {
            calc_data[obs] = {
              "start": obs_start,
              "end": obs_end,
              "title": obs_title,
              "id": obs_id
            }
          }

        }
      }
      //parse through response.data to save start,end,title, and id in a calendar array
      this.algTodosTimes = calc_data;

    },
    closeModal() {
      this.$refs["add-modal"].hide();
      this.$refs["edit-modal"].hide();
      this.calendarEvent = {};
    },
    openEditModal(event) {
      let { id, start, end, title } = event;
      this.calendarEvent = { id, start, end, title };
      this.$refs["edit-modal"].show();
    },
    async add() {
      if(this.input.length == 0 || this.hours.length == 0){
        alert("Please input a task to complete and estimated hours to completion.");
      }
      else
      {
        //add todo to array
        this.todos.push([this.input,this.hours]);
        //set tasks to save state of todo
        this.$store.commit("setTasks", this.todos);
        //clear input forms
        this.input = "";
        this.hours = "";
        //enable 'fill calendar' button when tasks in list
        this.isButtonDisabled = false;
      }
    },
    async remove() {
        //alert if input forms not empty when 'fill calendar' button clicked
        if (this.input != "" || this.hours != ""){
          alert("There is text in the input forms.  Please confirm you are done creating tasks and the input forms are clear before clicking 'Optimize Calendar'");
          return; //exit function so user can edit input forms
        }
        //initialize temporary array when 'Fill Calendar' clicked
        this.algTodosTimes = [];
        //fill in calendar with all tasks from todo list
        while (this.todos.length > 0)
        {
          //reverse list order to pop off first item in list
          this.todos.reverse();
          const task = this.todos.pop();
          //init start/end times
          let start = moment(currentDate.setHours(currentDate.getHours())).format("YYYY-MM-DD HH:mm:ss");
          let end = moment(currentDate.setHours(currentDate.getHours()))
            .format("YYYY-MM-DD HH:mm:ss");

          let title = task[0];
          let est = task[1];
          //fill array to display task time designations/ reorder events
          //this.algTodosTimes.push([title,start,end]);
          //fill temp array to refill todos if user unsatisfied with task distribution
          this.tempTodos.push([title,est]);

          //console.log(this.calendarEvent);
          //TODO
          //send initial calendar event info to backend
          //add event to calendar
          this.calendarEvent = { start, end, title, est };
          await this.addCalendar(this.calendarEvent);
          //backend computes start/end time based on est. hours
          //backend posts to db


          //reverse back to maintain order
          this.todos.reverse();
        }
        // getCalendar() when task list empty
        if(this.todos.length == 0)
        {
          //once task list empty and db filled with new tasks
          //loop thru tasks just added, get their start and end times calculated in backend
          this.getAlgTimes();
          // console.log(this.algTodosTimes);
          // let alertTitle, alertStart, alertEnd;
          // this.taskTimes = "";
          // //console.log(calc_times);
          // const arrayLength = this.algTodosTimes.length;
          //
          // for (var i = 0; i < arrayLength; i++)
          // {
          //   let alertTitle = this.algTodosTimes[i][0];
          //   let alertStart = this.algTodosTimes[i][1];
          //   let alertEnd = this.algTodosTimes[i][2];
          //   this.taskTimes +=  "\n" + alertTitle + " from " + alertStart + " to " + alertEnd;
          // }
          //then send alert to user of these task times
          //parse out individual task times to display to user

          //2 buttons enable at this point, accept or decline
          this.approvalReq = false;
          //if user hits accept, the tasks stay in the db and are displayed in the calendar.
          //else 'decline', the tasks are deleted from the db by their respective ids

          //TODO delete these comments
          // //Highlight where task events added
          // alert("The Task List has been distributed in the calendar at the following time(s):" + this.taskTimes);
          // //Check here if user happy with distribution
          // if (confirm("Click 'OK' if you are satisfied with the calendar.  To redistribute the tasks in different times, click 'Cancel' and 'Fill Calendar' again."))
          // {
          //   this.consent = true;   //user happy with distribution of tasks
          //Display events added without page reload
          await this.getEvents();
          console.log(this.algTodosTimes);
          let alertTitle, alertStart, alertEnd;
          this.taskTimes = "";
          //console.log(calc_times);
          const arrayLength = this.algTodosTimes.length;

          for (var i = 0; i < arrayLength; i++)
          {
            if (this.algTodosTimes[i] != null)
            {
              alertTitle = this.algTodosTimes[i]['title'];
              alertStart = this.algTodosTimes[i]['start'];
              alertEnd = this.algTodosTimes[i]['end'];
              this.taskTimes +=  "\n" + alertTitle + " from " + alertStart + " to " + alertEnd;
            }

          }
          //Highlight where task events added
          alert("The Task List has been distributed in the calendar at the following time(s):" + this.taskTimes);

        }
      },
      async accept() {
        this.consent = true;   //user happy with distribution of tasks
        this.approvalReq = true;
        this.algTodosTimes = [];
        //Display events added without page reload
        await this.getEvents();
      },
      async decline() {
        //repopulate the task lists and delete the tasks from the db
        let tempInput = '';
        let tempHours = '';
        let alertId;
        this.consent = false;  //user wishes to redistribute the tasks
        for (var t=0; t < this.tempTodos.length; t++)
        {
          tempInput = this.tempTodos[t][0];
          tempHours = this.tempTodos[t][1];
          this.todos.push([tempInput,tempHours]); //this should display the tasks list again
        }
        //reset tempTodos
        this.tempTodos = [];
        for (var j=0; j < this.algTodosTimes.length; j++)
        {
          if (this.algTodosTimes[j] != null)
          {
            alertId = this.algTodosTimes[j]['id'];
            await this.deleteCalendar(alertId);
          }
        }
        //this.todos = this.tempTodos;
        this.isButtonDisabled = false;
        this.approvalReq = true;
        await this.getEvents();
      }
  }
};
</script>
<style lang="scss" scoped>
.page {
  width: 1000px;
}
.buttons {
  margin-bottom: 10px;
}
h2 {
  margin-left: 40;
  margin-top: 0px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
button {
  color: #42b983;
  background-color: #add8e6;
}
</style>
