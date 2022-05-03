<script>
  import { onDestroy, onMount } from "svelte";
  /* import { validate_component } from "svelte/internal"; */
  import { username } from "./store.js";

  export let name;
  let vid;
  let src;
  let justSeeked = false;
  let users = [];

  function load(node, src) {
    if (src) {
      node.src = src;
      node.load();
    }
    return {
      update(src) {
        if (src) {
          node.src = src;
          node.load();
        }
      },
    };
  }
  onMount(() => {
    vid = document.getElementById("vid");
    let skipb = document.getElementById("skipb");
    let skipf = document.getElementById("skipf");
    let un = "";
    username.subscribe((val) => (un = val));
    var ws = new WebSocket(`ws://localhost:3000/room/${name}?username=${un}`);
    ws.addEventListener("open", function (event) {
      console.log(`got username as ${username.username}`);
      let un = "";
      username.subscribe((value) => (un = value));
      ws.send(JSON.stringify({ type: "join", data: `${un}` }));
    });

    ws.onmessage = function (event) {
      console.log(event.data);
      let jsonData = JSON.parse(event.data);
      console.log(jsonData);
      switch (jsonData.type) {
        case "join":
          users = [...users, jsonData.data];
          break;
        case "leave":
          users = users.filter((val, i, arr) => val != jsonData.data);
          break;
        case "pause":
          vid.currentTime = jsonData.data;
          vid.pause();
          break;
        case "play":
          vid.currentTime = jsonData.data;
          vid.play();
          break;
        case "seek":
          vid.currentTime = jsonData.data;
          break;
        case "vid":
          src = `https://small-bonus-7f1f.manfromth3m0on.workers.dev/?${jsonData.data}`;
          /*
          console.log(src);

          if (document.contains(document.getElementById("vid-src"))) {
            document.getElementById("vid-src").remove;
          }

          var source = document.createElement("source");
          source.setAttribute(
            "src",
            `https://small-bonus-7f1f.manfromth3m0on.workers.dev/?${src}`
          );
          source.setAttribute("id", "vid-src");
          vid.appendChild(source);
          */
          break;
      }
    };

    vid.addEventListener("pause", () => {
      console.log("Paused");
      ws.send(JSON.stringify({ type: "pause", data: `${vid.currentTime}` }));
    });

    vid.addEventListener("play", () => {
      console.log("Playing");
      ws.send(JSON.stringify({ type: "play", data: `${vid.currentTime}` }));
    });

    vid.addEventListener("seeked", () => {
      if (justSeeked === false) {
        console.log(`Seeked to ${vid.currentTime}`);
        ws.send(JSON.stringify({ type: "seek", datA: `${vid.currentTime}` }));
        justSeeked = true;
      } else {
        console.log("Seeded recently");
        justSeeked = false;
      }
    });

    skipb.addEventListener("click", () => {
      ws.send(JSON.stringify({ type: "skipb" }));
    });

    skipf.addEventListener("click", () => {
      ws.send(JSON.stringify({ type: "skipf" }));
    });
  });

  onDestroy(() => {
    console.log("Disconnecting");
    ws.close();
  });

  function seek(dir) {
    ws.send(JSON.stringify({ seek: dir }));
  }
</script>

<div class="room">
  <h1>Room: {name}</h1>
  <div class="panes">
    <div class="vidpanel">
      <!-- svelte-ignore a11y-media-has-caption -->
      <video id="vid" use:load="{src}" controls autoplay />
    </div>
    <div class="controls">
      <h1>controls</h1>
      <div>
        <ul>
          {#each users as user}
            <li>{user}</li>
          {/each}
        </ul>
      </div>
      <div class="buttons">
        <button id="skipb"> &#60; </button>
        <button id="skipf"> &#62; </button>
      </div>
    </div>
  </div>
</div>

<style>
  .room {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100vw;
  }
  .panes {
    display: flex;
    justify-content: center;
    flex-direction: row;
    width: 100vw;
    height: 90vh;
  }
  .vidpanel {
    width: 75vw;
  }
  .controls {
    width: 25vw;
  }

  #vid {
    width: 100% !important;
    height: auto !important;
  }
</style>
