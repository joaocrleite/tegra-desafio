<template>
  <div class="search-bar card">
    <div class="card-header">
      <div class="card-header-title">Passagens aéreas</div>
    </div>
    <div class="card-content">
      <div class="block">
        <b-radio v-model="radio" name="radio" native-value="1" disabled>Ida e Volta</b-radio>
        <b-radio v-model="radio" name="name" native-value="2">Só Ida</b-radio>
        <b-radio v-model="radio" name="name" native-value="3" disabled>Multidestino</b-radio>
      </div>
      <div class="columns">
        <div class="column">
          <b-field
            label="Origem"
            :type="this.errors.from != null ? 'is-danger' : null "
            :message="this.errors.from"
          >
            <b-select placeholder="Selecione" expanded v-model="from">
              <option
                v-for="airport in airports"
                :value="airport.id"
                :key="airport.id"
              >{{ airport.slug }} - {{ airport.name }}</option>
            </b-select>
          </b-field>
        </div>

        <div class="column">
          <b-field
            label="Destino"
            :type="this.errors.to != null ? 'is-danger' : null "
            :message="this.errors.to"
          >
            <b-select placeholder="Selecione" expanded v-model="to">
              <option
                v-for="airport in airports"
                :value="airport.id"
                :key="airport.id"
              >{{ airport.slug }} - {{ airport.name }}</option>
            </b-select>
          </b-field>
        </div>

        <div class="column">
          <b-field
            label="Data"
            :type="this.errors.when != null ? 'is-danger' : null "
            :message="this.errors.when"
          >
            <b-datepicker
              v-model="when"
              :min-date="whenMinDate"
              :max-date="whenMaxDate"
              placeholder="Selecione"
              icon="calendar-today"
            ></b-datepicker>
          </b-field>
        </div>

        <div class="column search-button">
          <button class="button is-primary is-fullwidth" @click="search">Procurar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: 2,
      airports: [],
      from: null,
      to: null,
      when: new Date(2019, 1, 10),
      whenMinDate: new Date(2019, 1, 10),
      whenMaxDate: new Date(2019, 1, 18),
      errors: {
        from: null,
        to: null,
        when: null
      },
      results: []
    };
  },
  mounted() {
    this.loadAirports();
  },
  methods: {
    loadAirports() {
      this.$store.commit("START_LOADING");
      this.$axios
        .get("http://laravel.tegra.com.la/airports")
        .then(res => {
          this.airports = res.data.data;
          this.$store.commit("STOP_LOADING");
        })
        .catch(err => {});
    },
    clearErrors() {
      this.errors = {
        from: null,
        to: null,
        when: null
      };
    },
    valid() {
      this.clearErrors();

      var hasErrors = true;

      if (this.from == null) {
        this.errors.from = "Required!";
        hasErrors = false;
      }

      if (this.to == null) {
        this.errors.to = "Required!";
        hasErrors = false;
      }

      if (this.when == null) {
        this.errors.when = "Required!";
        hasErrors = false;
      }

      return hasErrors;
    },
    search() {
      if (this.valid()) {
        var formData = this.formData();

        this.$store.commit("START_LOADING");

        this.$axios
          .get("http://laravel.tegra.com.la/search", { params: formData })
          .then(res => {
            this.$emit('refreshResults', this.resolveResults(res.data.sorted));

            this.$store.commit("STOP_LOADING");
          })
          .catch(err => {
            // var errors = err.response.data.erros;

            console.log(err);
          });
      }
    },

    formData() {
      var year = this.when.getFullYear();
      var month = this.when.getMonth() + 1;
      if (month < 10) {
        month = "0" + month.toString();
      }

      var day = this.when.getDate();
      if (day < 10) {
        day = "0" + day.toString();
      }

      var date = year + "-" + month + "-" + day;

      return {
        from: this.from,
        to: this.to,
        date
      };
    },

    resolveResults(rawResults) {
      var flights = [];

      for (var i = 0; i < rawResults.length; i++) {
        var rawRow = rawResults[i];
        var rawScales = rawRow.scales;

        var take_off = this.resolveDate(rawRow.take_off_at);
        var landing = this.resolveDate(rawRow.landing_at);

        var flight = {
          from: rawRow.from,
          to: rawRow.to,
          take_off,
          landing,
          totalAmount: 0.0,
          scales: []
        };

        var previewLanding = null;

        for (var y = 0; y < rawScales.length; y++) {
          var scaleRow = rawScales[y];

          var take_off = this.resolveDate(scaleRow.take_off_at);
          var landing = this.resolveDate(scaleRow.landing_at);

          var waiting = null;

          if(previewLanding){

            waiting = this.resolveWaiting(scaleRow.from, previewLanding, take_off);

          }

          previewLanding = landing;

          var scale = {
            from: scaleRow.from,
            to: scaleRow.to,
            take_off,
            landing,
            amount: parseFloat(scaleRow.amount).toFixed(2),
            company: scaleRow.company,
            waiting,
          };

          flight.totalAmount += scale.amount;

          flight.scales.push(scale);
        }

        flight.totalAmount = parseFloat(flight.totalAmount).toFixed(2);

        flights.push(flight);
      }

      return flights;
    },

    dateUnparse(rawDate) {
      var parts = rawDate.split(" ");

      var dates = parts[0];
      var times = parts[1];

      var datesParts = dates.split("-");
      var timesParts = times.split(":");

      return new Date(
        datesParts[0],
        datesParts[1] - 1,
        datesParts[2],
        timesParts[0],
        timesParts[1],
        timesParts[2]
      );
    },
    dateParse() {},

    dateHuman(date) {
      var now = new Date();

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month < 10) {
        month = "0" + month.toString();
      }

      var day = date.getDate();
      if (day < 10) {
        day = "0" + day.toString();
      }

      var hours = date.getHours();
      if (hours < 10) {
        hours = "0" + hours.toString();
      }

      var minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes.toString();
      }

      return {
        time: hours + ":" + minutes,
        date: day + "/" + month + "/" + year
      };
    },

    resolveDate(rawDate) {
      var original = rawDate;
      var date = this.dateUnparse(original);
      var human = this.dateHuman(date);

      return { original, date, human };
    },

    resolveWaiting(flight, preview, next){

      var seconds = (next.date.getTime() - preview.date.getTime()) / 1000;

      var minutes = seconds / 60;

      var hours = Math.floor(minutes / 60);
      var minutes = minutes % 60;

      var waiting = {
        city : flight.city,
        hours,
        minutes
      };


      return waiting;
    }
  }
};
</script>
