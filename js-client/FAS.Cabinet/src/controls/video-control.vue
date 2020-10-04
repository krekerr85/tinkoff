<template>
  <div class="video-control">
    <video ref="videoPlayer" class="video-control__player" crossorigin playsinline></video>
  </div>
</template>

<script>
  import Plyr from 'plyr';
  import dashjs from 'dashjs';
  import Hls from 'hls.js';
  import setCookie from 'set-cookie';

  export default {
    name: "VideoPlayer",
    props: {
      src: String,
      accessKey: String
    },
    data() {
      return {
        player: null,
        hlsInstance: null,
        currentAccessKey: null,
      }
    },
    mounted() {
      this.resetSpeed();
      if (this.src)
        this.initPlayer();
      const self = this;
      this.player.on('ended', function () {
        self.$emit('ended');
      });
    },
    watch: {
      src: function (newVal) {
        if (newVal)
          this.initPlayer();
      }
    },
    beforeDestroy() {
      if (this.player && this.player.dispose) {
        this.player.dispose()
      }
      if (this.hls && this.hls.destroy) {
        this.hls.destroy();
      }
    },
    methods: {
      initPlayer() {
        const self = this;
        const options = {
          autoplay: true,
          captions: {active: true, update: true}
        };
        this.player = new Plyr(this.$refs.videoPlayer, options);

        if (!Hls.isSupported()) {
          setCookie('Authorization', 'Bearer ' + self.accessKey, {path: '/video/courses'});
          this.$refs.videoPlayer.src = this.src;
        }
        else{
          const hls = new Hls({
            xhrSetup: function(xhr, url) {
              xhr.setRequestHeader('Authorization', 'Bearer ' + self.accessKey);
            },
            maxBufferHole: 0
          });
          hls.loadSource(this.src);
          hls.attachMedia(this.$refs.videoPlayer);
          this.hls = hls;
        }               

      },
      resetSpeed(){
        // иногда плеер тупит и зачем то записывает настройки в localStorage
        try{
          const settingsString = localStorage.getItem('plyr');
          if(settingsString){
            const settingsObj = JSON.parse(settingsString);
            if(settingsObj.speed!=1){
              settingsObj.speed = 1;
              localStorage.setItem('plyr', JSON.stringify(settingsObj));
            }
          }          
        }
        catch(e){}
      }
    }
  }
</script>

<style>
  .video-control {
    &__player {
      max-width: 100%;
    }
  }
</style>
