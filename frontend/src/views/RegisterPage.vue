<!--
The register page component renders a simple registration form with first name, last name, username and password fields. It displays validation messages for invalid fields when the user attempts to submit the form. If the form is valid, submitting it causes the 'account/register' vuex action to be dispatched along with the data entered into the form.

Form validation is implemented with the VeeValidate library
-->
<template>
    <div>
        <h2>Register</h2>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(submit)">
              <div class="form-group">
                  <label for="firstName">First Name</label>
                  <ValidationProvider v-slot="{ errors }">
                    <input type="text" v-model="user.firstName" name="firstName" class="form-control" />
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
              </div>
              <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <ValidationProvider v-slot="{ errors }">
                    <input type="text" v-model="user.lastName" name="lastName" class="form-control" />
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
              </div>
              <div class="form-group">
                  <label for="username">Username</label>
                  <ValidationProvider v-slot="{ errors }">
                    <input type="text" v-model="user.username" name="username" class="form-control" />
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
              </div>
              <div class="form-group">
                  <label htmlFor="password">Password</label>
                  <ValidationProvider v-slot="{ errors }">
                    <input type="password" v-model="user.password" name="password" class="form-control" />
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
              </div>
              <div class="form-group">
                  <button class="btn btn-primary" :disabled="status.registering">Register</button>
                  <img v-show="status.registering" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                  <router-link to="/login" class="btn btn-link">Cancel</router-link>
              </div>
          </form>
        </ValidationObserver>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data () {
        return {
            user: {
                firstName: '',
                lastName: '',
                username: '',
                password: ''
            },
            submitted: false
        }
    },
    computed: {
        ...mapState('account', ['status'])
    },
    methods: {
        ...mapActions('account', ['register']),
        submit() {
          // Only executes when validation passes
            this.submitted = true;
            this.register(this.user);
            //$validator deprecated and removed in vee-validator 3.0

            // this.$validator.validate().then(valid => {
            //     if (valid) {
            //         this.register(this.user);
            //     }
            // });
        }
    }
};
</script>
