<template>
  <form class="shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
    <div class="mb-4">

      <vc-date-picker
          v-model="range"
          mode="date"
          :masks="masks"
          is-range
      >
        <template v-slot="{ inputValue, inputEvents, isDragging }">
          <div class="flex flex-col sm:flex-row justify-start items-center">
<!--            <p class="flex">-->

              <input
                  class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"
                  :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                  :value="inputValue.start"
                  @input="$emit('input', $event.target.value)"
                  v-on="inputEvents.start"/>
<!--                  @input="$emit('input', $event.target.value)"-->

<!--            to-->
<!--            </p>-->

<!--            <div class="flex">-->

<!--              <input-->
<!--                  class="flex-grow pl-8 pr-2 py-1 bg-gray-100 border rounded w-full"-->
<!--                  :class="isDragging ? 'text-gray-600' : 'text-gray-900'"-->
<!--                  :value="inputValue.end"-->
<!--                  v-on="inputEvents.end"-->
<!--              />-->
<!--            </div>-->
          </div>
        </template>
      </vc-date-picker>
    </div>
  </form>
</template>

<script>
export default {
  name: 'DateRangeSelector',
  data() {
    return {
      range: {
        start: new Date(2020, 0, 6),
        end: new Date(2020, 0, 23),
      },
      masks: {
        input: 'YYYY-MM-DD',
      },
    };
  },
};
</script>

<style scoped>

</style>
