<template>
  <ValidationObserver ref="form">
    <form @submit.prevent="validate">
      <div class="row justify-content-center">
        <div class="col-sm-12">
          <h5 class="info-text">Are you living in a nice area?</h5>
        </div>
        <div class="col-sm-7">

          <ValidationProvider
            name="street"
            rules="required|min:5"
            v-slot="{ passed, failed, errors }"
          >
          <base-input
            v-model="street"
            label="Street Name"
            :error="errors[0]"
            :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
          </base-input>
         </ValidationProvider>
        </div>
        <div class="col-sm-3">
          <ValidationProvider
            name="streetNo"
            rules="required"
            v-slot="{ passed, failed, errors }"
          >
          <base-input
            v-model="streetNo"
            label="Street No"
            :error="errors[0]"
            :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
          </base-input>
         </ValidationProvider>
        </div>
        <div class="col-sm-5">
          <ValidationProvider
            name="city"
            rules="required"
            v-slot="{ passed, failed, errors }"
          >
          <base-input
            v-model="city"
            label="City"
            :error="errors[0]"
            :class="[{ 'has-success': passed }, { 'has-danger': failed }]">
          </base-input>
         </ValidationProvider>
        </div>
        <div class="col-sm-5">
          <label>Country</label>

          <ValidationProvider
            name="country"
            rules="required|min:5"
          >
          <base-input>
            <el-select
              v-model="country"
              class="select-primary"
              name="country"
            >
              <el-option
                v-for="country in countryOptions"
                class="select-primary"
                :label="country"
                :value="country"
                :key="country"
              ></el-option>
            </el-select>
          </base-input>
         </ValidationProvider>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>
<script>
import { Select, Option } from 'element-ui';

export default {
  components: {
    [Select.name]: Select,
    [Option.name]: Option
  },
  data() {
    return {
      street: '',
      streetNo: '',
      city: '',
      country: '',
      countryOptions: [
        'Australia',
        'Germany',
        'Netherlands',
        'USA',
        'UK',
        'New Zealand'
      ]
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      return this.$refs.form.validate().then(res => {
        if (!res) {
          return;
        }
        this.$emit("on-validated", res);
        return res;
      });
    }
  }
};
</script>
<style></style>
