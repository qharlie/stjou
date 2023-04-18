<template>
  <ValidationObserver v-slot="{ handleSubmit }">
  <form @submit.prevent="handleSubmit(submit)">
    <card footer-classes="text-left">
      <div slot="header"><h4 class="card-title">Login Form</h4></div>
      <div>
        <ValidationProvider
          name="fullname"
          rules="required|min:3"
          v-slot="{ passed, failed, errors }"
        >
        <base-input
          required
          v-model="fullname"
          label="Full Name"
          :error="errors[0]"
          :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
        </base-input>
       </ValidationProvider>

          <ValidationProvider
            name="email"
            rules="required|email"
            v-slot="{ passed, failed, errors }"
          >
          <base-input
            required
            v-model="email"
            type="email"
            label="Email address"
            :error="errors[0]"
            :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
          </base-input>
         </ValidationProvider>

         <ValidationProvider
           name="password"
           rules="required|min:5"
           v-slot="{ passed, failed, errors }"
         >
         <base-input
           required
           v-model="password"
           type="password"
           label="Password"
            :error="errors[0]"
           :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
         </base-input>
        </ValidationProvider>
        <div class="category form-category">* Required fields</div>
      </div>

      <template slot="footer">
        <base-button
          native-type="submit"
          type="primary"
          >Login</base-button
        >
        <a href="javascript:void(0)" class="pull-right">Forgot password?</a>
      </template>
    </card>
  </form>
 </ValidationObserver>
</template>
<script>

import { extend } from "vee-validate";
import { required, email, min } from "vee-validate/dist/rules";
import { configure } from 'vee-validate';

extend("email", email);
extend("required", required);
extend("min", min);

export default {
  data() {
    return {
      email: "",
      password: "",
      fullname: ""
    };
  },
  methods: {
    submit() {
      alert("Form has been submitted!");
    }
  }
};
</script>
<style></style>
