<template>
  <div>
    <div class="card">
      <div class="card-header">
        <div class="card-header-title">Passagens aéreas</div>
      </div>
      <div class="card-content">
         <div class="block">
            <b-radio v-model="radio"
                name="radio"
                native-value="1">
                Ida e Volta
            </b-radio>
            <b-radio v-model="radio"
                name="name"
                native-value="2">
                Só Ida
            </b-radio>
            <b-radio v-model="radio"
                name="name"
                native-value="3">
                Multidestino
            </b-radio>
        </div>
        <div class="columns">
          <div class="column">
            <b-field
              label="Origem"
              :type="this.errors.from != null ? 'is-danger' : null "
              :message="this.errors.from"
            >
              <b-select placeholder="Select a airport" expanded v-model="from">
                <option
                  v-for="airport in airports"
                  :value="airport.id"
                  :key="airport.id"
                >{{ airport.name }}</option>
              </b-select>
            </b-field>
          </div>

          <div class="column">
            <b-field
              label="Destino"
              :type="this.errors.to != null ? 'is-danger' : null "
              :message="this.errors.to"
            >
              <b-select placeholder="Select a airport" expanded v-model="to">
                <option
                  v-for="airport in airports"
                  :value="airport.id"
                  :key="airport.id"
                >{{ airport.name }}</option>
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
                placeholder="Click to select..."
                icon="calendar-today"
              ></b-datepicker>
            </b-field>
          </div>

          <div class="column">
            <button class="button is-primary is-fullwidth" @click="search">Find flights</button>
          </div>
        </div>
      </div>
    </div>

    <h1 class="title">Results</h1>

    <div class="card" v-for="(flight, index) in results" :key="index">
      <div class="card-content">
        <p>
          <b>From:</b>
          {{flight.from.name}}
          <br />
          <b>To:</b>
          {{flight.to.name}}
          <br />
          <b>Take-off:</b>
          {{flight.take_off.human.time}} {{flight.take_off.human.date}}
          <br />
          <b>Landing:</b>
          {{flight.landing.human.time}} {{flight.landing.human.date}}
          <br />
          <b>Total Amount:</b>
          $ {{flight.totalAmount}}
          <br />
        </p>

        <h2 class="subtitle">Steps</h2>

        <div class="card" v-for="(scale, index) in flight.scales" :key="'scale_' + index">
          <div class="card-content">
            <p>
              <b>From:</b>
              {{scale.from.name}}
              <br />
              <b>To:</b>
              {{scale.to.name}}
              <br />
              <b>Take-off:</b>
              {{scale.take_off.human.time}} {{scale.take_off.human.date}}
              <br />
              <b>Landing:</b>
              {{scale.landing.human.time}} {{scale.landing.human.date}}
              <br />
              <b>Amount:</b>
              $ {{scale.amount}}
              <br />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Card from '~/components/Card'

export default {
  name: "HomePage",
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
            this.results = this.resolveResults(res.data.sorted);

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

        for (var y = 0; y < rawScales.length; y++) {
          var scaleRow = rawScales[y];

          var take_off = this.resolveDate(scaleRow.take_off_at);
          var landing = this.resolveDate(scaleRow.landing_at);

          var scale = {
            from: scaleRow.from,
            to: scaleRow.to,
            take_off,
            landing,
            amount: parseFloat(scaleRow.amount).toFixed(2)
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
    }
  }
};
</script>
