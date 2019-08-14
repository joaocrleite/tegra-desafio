<template>
  <div class="flights">
    <div class="card card-flight" v-for="(flight, index) in results" :key="index">
      <div class="columns">
        <div class="column card-info-side">
          <div class="base-infos columns">
            <div class="date column">
              <p class="title">IDA</p>
              <p class="subtitle">{{flight.take_off.human.date}}</p>
            </div>
            <div class="from column">
              <p class="title">{{flight.from.slug}}</p>
              <p class="subtitle">{{flight.from.city.name}}</p>
            </div>
            <div class="to column">
              <p class="title">{{flight.to.slug}}</p>
              <p class="subtitle">{{flight.to.city.name}}</p>
            </div>
          </div>

          <div class="card-content scales">
            <div class="scale" v-for="(scale, index) in flight.scales" :key="'scale_' + index">
              <div class="card card-scale-waiting" v-if="scale.waiting">
                <p>
                  <span>
                    <b-icon icon="clock" size="is-small"></b-icon>
                  </span>
                  <span>
                    Espera de
                    <b class="scale-waiting-time">
                      <span v-if="scale.waiting.hours > 0">{{scale.waiting.hours}}h</span>
                      <span v-if="scale.waiting.minutes > 0">{{scale.waiting.minutes}}m</span>
                    </b> em
                    <b class="scale-waiting-city">{{scale.waiting.city.name}}</b>
                    (Troca de avião)
                  </span>
                </p>
              </div>
              <!-- /card-scale-waiting -->

              <div class="card card-scale">
                <div class="columns">
                  <div class="column company">
                    <p class="subtitle">Operado por</p>
                    <p class="title">{{scale.company.name}}</p>
                  </div>

                  <div class="column take-off">
                    <p class="subtitle">Saída</p>
                    <p class="title">{{scale.take_off.human.time}}</p>
                  </div>

                  <div class="column landing">
                    <p class="subtitle">Chegada</p>
                    <p class="title">{{scale.landing.human.time}}</p>
                  </div>

                  <div class="column duration">
                    <p class="subtitle">Duração</p>
                    <p class="title">1h 5m</p>
                  </div>
                </div>
                <!-- /columns -->
              </div>
              <!-- /card-scale -->
            </div>
            <!-- /scale -->
          </div>
          <!-- /scales-infos -->
        </div>
        <div class="column card-price-side">
          <div class="price-label">
            <p class="title">Preço final</p>
            <p class="subtitle">Tudo incluído!</p>
          </div>
          <div class="price-total">R$ {{flight.totalAmount | formatMoney}}</div>
          <button class="button is-success is-fullwidth" disabled>Selecionar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["results"],
  data() {
    return {
      list: []
    };
  },
  mounted() {},
  methods: {},
  filters: {
    formatMoney(amount) {
      var decimalCount = 2,
        decimal = ",",
        thousands = ".";

      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(
          (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
        ).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
          negativeSign +
          (j ? i.substr(0, j) + thousands : "") +
          i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
          (decimalCount
            ? decimal +
              Math.abs(amount - i)
                .toFixed(decimalCount)
                .slice(2)
            : "")
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
