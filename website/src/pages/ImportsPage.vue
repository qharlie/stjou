<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div style="width: 100%;text-align: center;">


          <div class="row">

            <div class="col-lg-12">
              <div class="alert alert-light" v-if="!selects.broker">Select a broker below and tap Select File to upload
                                                                    your dataset.
              </div>
              <div style="text-align: left;" class="alert alert-light" v-if="selects.broker === 'ameritrade'">
                For Thinkorswim Transactions, navigate to <a href="https://www.tdameritrade.com/" target="_blank">https://www.tdameritrade.com/</a>,
                login, hover over My Account, under the History & Statements column, select Transactions. Scroll down to
                select a date range for the export.
              </div>
              <div style="text-align: left;" class="alert alert-light" v-if="selects.broker === 'etrade'">
                For E*Trade Transactions, navigate to <a href="https://us.etrade.com/" target="_blank">https://us.etrade.com/</a>,
                Login, click Accounts, click Transactions, click the download arrow in the top right, and select
                'Spreadsheet Format including Microsoft® Excel' for the format
              </div>
              <div v-if="message" :class="message_class"> {{ message }}</div>

            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <h4 class="card-title">Select a Broker</h4>
        <el-select class="select-info" size="large" placeholder="Broker" v-model="selects.broker">
          <el-option v-for="option in selects.brokers" class="select-info" :value="option.value" :label="option.label"
                     :key="option.label"></el-option>
        </el-select> &nbsp;&nbsp;
        <button type="button" class="btn btn-info" @click="trigger" style="width: 200px;">
          <i class="fa fa-plus" aria-hidden="true"></i> Select File
        </button>
        <input type="file" ref="doc" @change="readFile()" style="display: none;"/>

      </div>

    </div>

    <div class="row">
      <div class="col-lg-12" style="margin-left: 15px;border: 1px solid #c9dae1;color: white;padding: 10px;">
        Options <br> <input id="missingVs" type="checkbox" v-model="estimateMissingValues"/> <label for="missingVs">
        Estimate missing values ( will use averages for missing buy data ). Defaults to false, will not include sells
        for missing buy data.</label>

      </div>
    </div>
    <div class="row">
      <div class="col-md-12">

        <base-table :data="tableData" thead-classes="text-primary">
          <template slot="columns">
            <th width="15%">Broker</th>
            <th width="15%">Filename</th>
            <th width="15%">Date</th>
            <th width="15%">Row Count</th>
            <th width="10%">Estimate</th>
            <th width="20%">Actions</th>
            <th width="5%">Delete</th>

          </template>

          <template slot-scope="{ row  }">


            <td>{{ row.broker }}</td>


            <td>{{ row.filename }}</td>


            <td>{{ row.date }}</td>
            <td>{{ row.row_count }}</td>
            <td>{{ row.estimate_missing_values }}</td>
            <td>
              <base-button @click="selectDataset(row.id)" round class="btn btn-twitter" v-if="row.id != current_id">
                &nbsp;Activate&nbsp;
              </base-button>
              <base-button round class="btn btn-secondary" disabled v-if="row.id == current_id">Activated</base-button>

            </td>
            <td style="width: 10%;" @click="deleteDataset(row.id)"><i
                class="tim-icons icon-simple-remove stj-red-text"></i> <span
                style="text-decoration: underline;cursor: pointer;">Delete</span>
            </td>

          </template>
        </base-table>
        <div class="row">
          <!--        <div class="col-md-12">-->
          <!--          <div v-if="df" class="alert alert-success">{{ df.length }} rows in current dataset</div>-->
          <!--        </div>-->

        </div>
      </div>


    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import FileUpload from 'vue-upload-component'
import {TimeSelect, DatePicker, Select, Option} from 'element-ui';
import csv from 'csvtojson'
// import * as dfd from "danfojs-node"
import {csvToDF, extractPeriodSlice} from "@/DataTransformer";
import {BaseTable, BaseProgress} from '@/components';
import {hasLocalStorageSpace, randomString} from "@/util";
import swal from "sweetalert2";
import Jataframe from "@/Jataframe";

import {calculateLocalStorageSize} from "../util";
import idb from "@/db/idb";

export default {
  data: () => ({
        estimateMissingValues: false,
        message: '',
        message_class: "alert ",
        file: null, content: null, lastUpdated: null,
        selects: {
          brokers: [{
            label: 'TD Ameritrade',
            value: 'ameritrade'
          }, {
            label: 'E-Trade',
            value: 'etrade'
          }, {
            label: 'Fidelity',
            value: 'fidelity'
          }],

          broker: ''
        },
      }
  ),

  components: {
    FileUpload,
    TimeSelect,
    BaseTable,
    [DatePicker.name]: DatePicker,
    [TimeSelect.name]: TimeSelect,
    [Option.name]: Option,
    [Select.name]: Select,
  },

  computed: {
    tableData() {

      return this.$store.state.imports.map(row => {
        return {
          filename: row.filename,
          broker: row.broker,
          date: row.date,
          row_count: row.row_count,
          id: row.id,
          estimate_missing_values: row.estimate_missing_values
        }
      })
    },
    current_id() {
      return this.$store.state.currentDatasetId;
    },
    df: function () {
      return this.$store.state.df;
    }
  },

  created() {
    this.$store.dispatch('getImports');
    this.$store.dispatch('getImportData');
  },
  methods: {
    deleteDataset(id) {
      swal.fire({
        title: `Do you want remove this dataset? (id: ${id})`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap imports-page',
          confirmButton: 'order-3 stj-red-text imports-page',
          denyButton: 'order-2 imports-page',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.message_class = "alert alert-danger alert-info";
          this.message = 'Dataset deleted';
          this.$store.dispatch('removeImport', id);
          this.$store.dispatch('getImports');
          // this.$store.dispatch('getImportData');
        } else if (result.isDenied) {
          this.message_class = "alert  alert-info";
          this.message = 'Dataset not deleted';
        }
      })
    },
    selectDataset(id) {

      const data = this.$store.state.import_data.find(row => row.id === id).data;
      const df = new Jataframe(data);
      const startDate = this.$store.state.startDate;
      const endDate = this.$store.state.endDate;
      this.$store.commit('setDF', df);
      this.period_df = extractPeriodSlice(df, startDate, endDate);
      this.$store.commit('setPeriodDF', this.period_df);
      this.$store.commit('setLastUpdated', new Date());
      this.$store.commit('setCurrentDatasetId', id);
      this.$store.commit('setIsSampleData', false);
      this.message = 'You activated ' + df.length + ' rows to local storage with ' + this.$store.state.closers.length + ' closes.';
      this.message_class = 'alert alert-success';


    },

    readFile() {
      if (!this.selects.broker) {
        alert('Please select a broker first');
      } else {

        this.file = this.$refs.doc.files[0];
        const reader = new FileReader();
        const estimate = this.estimateMissingValues;

        reader.onload = async (res) => {
          const df = await csvToDF(res.target.result, this.selects.broker, this.estimateMissingValues);
          const import_meta = {
            filename: this.file.name,
            broker: this.selects.broker,
            date: new Date().toISOString().slice(0, 10),
            row_count: df.length,
            estimate_missing_values: estimate ? 'true' : 'false',
            id: randomString(10)
          };
          const startDate = this.$store.state.startDate;
          const endDate = this.$store.state.endDate;
          this.period_df = extractPeriodSlice(df, startDate, endDate);

          const import_data = {
            id: import_meta.id,
            data: df.data
          }

          const dfSize = JSON.stringify(df.data).replace(/[\[\]\,\"]/g, '').length; //stringify and remove all "stringification" extra data
          const periodSize = JSON.stringify(this.period_df.data).replace(/[\[\]\,\"]/g, '').length; //stringify and remove all "stringification" extra data

          const newSize = dfSize + periodSize; // Estimate for period length;
          // See if there is room to save it first
          const sevenMB = 1024 * 1024 * 7;
          const existingSize = calculateLocalStorageSize();
          const condition = (existingSize + newSize) <= sevenMB;

          const payload = {
            meta: import_meta,
            data: import_data,
            id: import_meta.id
          }

          this.$store.dispatch('addImport', payload);
          // this.$store.commit('addImport', {meta: import_meta, data: import_data});
          this.$store.commit('setDF', df);
          this.$store.commit('setPeriodDF', this.period_df);
          this.$store.commit('setLastUpdated', new Date());
          this.$store.commit('setIsSampleData', false);
          this.$store.commit('setCurrentDatasetId', import_meta.id)
          // this.$router.push('dashboard')
          this.message = 'You imported ' + df.length + ' rows to local storage with ' + this.$store.state.closers.length + ' closes.';
          this.message_class = 'alert alert-success';

          this.$store.dispatch('getImports');

        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(this.file);
      }
    },
    trigger() {
      if (!this.selects.broker) {
        swal.fire({
          title: 'Please select a broker',
          text: 'Please select a broker before choosing a file',
          showConfirmButton: true,
          confirmButtonText: 'OK',
        });
      } else {
        this.$refs.doc.click();
      }
    }
  }
}
</script>

<style></style>
