<template>
  <ValidationObserver v-slot="{ handleSubmit }">
  <form class="form-horizontal" @submit.prevent="handleSubmit(submit)">
    <card>
      <h4 slot="header" class="card-title">Type Validation</h4>
      <div>
        <div class="row">
          <label class="col-sm-2 col-form-label">Requred Text</label>
          <div class="col-sm-7">
            <ValidationProvider
              name="required"
              rules="required"
              v-slot="{ passed, failed, errors }"
            >
            <base-input
              required
              v-model="required"
              :error="errors[0]"
              :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
            </base-input>
           </ValidationProvider>
          </div>
          <label class="col-sm-3 label-on-right"
            ><code>required="true"</code></label
          >
        </div>

        <div class="row">
          <label class="col-sm-2 col-form-label">Email</label>
          <div class="col-sm-7">
            <ValidationProvider
              name="email"
              rules="required|email"
              v-slot="{ passed, failed, errors }"
            >
            <base-input
              required
              v-model="email"
              type="email"
              :error="errors[0]"
              :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
            </base-input>
           </ValidationProvider>
          </div>
          <label class="col-sm-3 label-on-right"
            ><code>email="true"</code></label
          >
        </div>

        <div class="row">
          <label class="col-sm-2 col-form-label">Number</label>
          <div class="col-sm-7">
            <ValidationProvider
              name="number"
              rules="required|numeric"
              v-slot="{ passed, failed, errors }"
            >
            <base-input
              required
              v-model="number"
              :error="errors[0]"
              :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
            </base-input>
           </ValidationProvider>
          </div>
          <label class="col-sm-3 label-on-right"
            ><code>numeric="true"</code></label
          >
        </div>

        <div class="row">
          <label class="col-sm-2 col-form-label">Url</label>
          <div class="col-sm-7">
            <ValidationProvider
              name="url"
              :rules="{
                required: true,
                regex: /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g
              }"
              v-slot="{ passed, failed, errors }"
            >
            <base-input
              v-model="url"
              type="text"
              :error="errors[0]"
              :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
            </base-input>
           </ValidationProvider>
          </div>
          <label class="col-sm-3 label-on-right"><code>url="true"</code></label>
        </div>

        <div class="row">
          <label class="col-sm-2 col-form-label">Url</label>
          <div class="col-sm-3">
            <ValidationProvider
            name="equal"
            rules="required|confirmed:confirmation"
            v-slot="{ passed, failed, errors }"
            >
            <base-input
              v-model="equal"
              type="text"
              :error="errors[0]"
              :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
            </base-input>
           </ValidationProvider>
          </div>
          <div class="col-sm-3">
            <ValidationProvider
            name="equalTo"
            rules="required"
            vid="confirmation"
            v-slot="{ passed, failed, errors }"
            >
            <base-input
              v-model="equalTo"
              type="text"
              :error="errors[0]"
              :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
            </base-input>
           </ValidationProvider>
          </div>

          <label class="col-sm-4 label-on-right"
            ><code>confirmed="equalToSource"</code></label
          >
        </div>
      </div>
      <div class="text-center">
        <base-button
          native-type="submit"
          type="primary"
          >Validate inputs</base-button
        >
      </div>
    </card>
  </form>
</ValidationObserver>
</template>
<script>
import { extend } from "vee-validate";
import { required, numeric, regex, confirmed } from "vee-validate/dist/rules";

extend("required", required);
extend("numeric", numeric);
extend("regex", regex);
extend("confirmed", confirmed);

export default {
  data() {
    return {
      required: "",
      email: "",
      number: "",
      url: "",
      equal: "",
      equalTo: ""
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
