<template>
  <ValidationObserver ref="form">
    <form @submit.prevent="validate">
    <div>
      <h5 class="info-text">
        Let's start with the basic information (with validation)
      </h5>
      <div class="row justify-content-center mt-5">
        <div class="col-sm-5">

          <ValidationProvider
            name="firstName"
            rules="required|min:5"
            v-slot="{ passed, failed, errors }"
          >
          <base-input
            required
            v-model="firstName"
            placeholder="First Name"
            addon-left-icon="tim-icons icon-single-02"
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
           placeholder="Email"
           addon-left-icon="tim-icons icon-email-85"
           :error="errors[0]"
           :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
         </base-input>
        </ValidationProvider>
        </div>
        <div class="col-sm-5">

          <ValidationProvider
            name="lastName"
            rules="required|min:5"
            v-slot="{ passed, failed, errors }"
          >
          <base-input
            required
            v-model="lastName"
            placeholder="Last Name"
            addon-left-icon="tim-icons icon-caps-small"
            :error="errors[0]"
            :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
          </base-input>
         </ValidationProvider>

         <ValidationProvider
           name="phone"
           rules="required|numeric"
           v-slot="{ passed, failed, errors }"
         >
         <base-input
           required
           v-model="phone"
           placeholder="Phone"
           addon-left-icon="tim-icons icon-mobile"
           :error="errors[0]"
           :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
         </base-input>
        </ValidationProvider>
        </div>
        <div class="col-sm-10">

          <ValidationProvider
            name="address"
            rules="required"
            v-slot="{ passed, failed, errors }"
          >
          <base-input
            required
            v-model="address"
            placeholder="Address"
            addon-left-icon="tim-icons icon-square-pin"
            :error="errors[0]"
            :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
          </base-input>
         </ValidationProvider>

        </div>
      </div>
    </div>
  </form>
</ValidationObserver>
</template>
<script>

import { extend } from "vee-validate";
import { required, numeric, email, min } from "vee-validate/dist/rules";

extend("email", email);
extend("required", required);
extend("numeric", numeric);


export default {
  data() {
    return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    };
  },
  methods: {
    validate() {
      return this.$refs.form.validate().then(res => {
        this.$emit("on-validated", res);
        return res;
      });
    }
  }
};
</script>
<style></style>
