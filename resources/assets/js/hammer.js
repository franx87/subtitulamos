/**
 * This file is covered by the AGPLv3 license, which can be found at the LICENSE file in the root of this project.
 * @copyright 2017-2019 subtitulamos.tv
 */

import Vue from "vue";
import $ from "jquery";

Vue.component("hammertarget", {
  template: `<div v-if='!deleted' class='hammer-user-block'>
        <a :href='\"/users/\"+id'>{{ username }}</a><br/>
            {{ total }} entradas totales ({{ corrected }} corregidas) - <a href="javascript:void()" @click='completeHammer'>Borrar todas</a><br/>
            {{ latest }} secuencias sin corregir <span v-show="latest > 0">- <a href="javascript:void()" @click='latestHammer'>Borrar</a></span>
    </div>`,
  props: ["id", "username", "countCorrected", "countLatest"],
  data: function() {
    return {
      corrected: this.countCorrected * 1,
      latest: this.countLatest * 1,
      deleted: false,
    };
  },
  computed: {
    total: function() {
      return this.latest + this.corrected;
    },
  },
  methods: {
    completeHammer: function() {
      alertify.confirm(
        "Estás a punto de eliminar TODAS las contribuciones de <b>" +
          this.username +
          "</b> en el subtítulo.<br/>¿Estás seguro de querer continuar?",
        () => {
          $.ajax({
            url: "/subtitles/" + subID + "/hammer",
            method: "POST",
            data: {
              user: this.id,
              type: "complete",
            },
          }).done(() => {
            this.deleted = true;
            this.corrected = 0;
            this.latest = 0;

            alertify.success(
              "Poof! Las contribuciones de <b>" + this.username + "</b> han sido eliminadas"
            );
          });
        }
      );
    },

    latestHammer: function() {
      alertify.confirm(
        "Estás a punto de eliminar las contribuciones sin corregir de <b>" +
          this.username +
          "</b> en el subtítulo.<br/>¿Estás seguro de querer continuar?",
        () => {
          $.ajax({
            url: "/subtitles/" + subID + "/hammer",
            method: "POST",
            data: {
              user: this.id,
              type: "latest",
            },
          }).done(() => {
            this.latest = 0;
            alertify.success(
              "Las contribuciones sin corregir de <b>" + this.username + "</b> han sido eliminadas"
            );
          });
        }
      );
    },
  },
});

let page = new Vue({
  el: "#hammer",
});
