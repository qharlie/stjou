<template>
  <ValidationObserver v-slot="{ handleSubmit }">
  <form @submit.prevent="handleSubmit(submit)">
    <card footer-classes="text-right">
      <div slot="header"><h4 class="card-title">Register Form</h4></div>
      <div>
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
         rules="required|confirmed:confirmation"
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

      <ValidationProvider
        name="confirm"
        vid="confirmation"
        rules="required"
        v-slot="{ passed, failed, errors }"
      >
      <base-input
        required
        v-model="confirmation"
        type="password"
        label="Confirm Password"
        :error="errors[0]"
        :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
      </base-input>
     </ValidationProvider>

        <div class="category form-category">* Required fields</div>
      </div>
      <template slot="footer" class="text-right">
        <base-checkbox
          v-model="subscribe"
          class="pull-left"
          name="subscribe"
        >
          Accept terms & conditions
        </base-checkbox>
        <base-button
          native-type="submit"
          type="primary"
          >Register</base-button
        >
      </template>
    </card>
  </form>
  </ValidationObserver>

</template>
<script>
import { BaseCheckbox } from 'src/components/index';
import { extend } from "vee-validate";
import { required, email, confirmed } from "vee-validate/dist/rules";
import { configure } from 'vee-validate';

extend("email", email);
extend("required", required);
extend("confirmed", confirmed);

export default {
  components: {
    BaseCheckbox
  },
  data() {
    return {
      email: "",
      password: "",
      confirmation: "",
      subscribe: false
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
