<script>
    import { onMount } from "svelte";
    import { validate_component } from "svelte/internal";
    import { seek } from "./handlers";

    export let name;
    let ws;
    let vid;
    let users;

    onMount(() => {
        vid = document.getElementById("vid");
        ws = new WebSocket(`ws://localhost:3000/room/${name}`);
        ws.addEventListener("open", function (event) {
            ws.send("Hello Server!");
        });

        ws.addEventListener("message", function (event) {
            jsonData = JSON.parse(event.data);
            switch (jsonData.type) {
                case "join":
                    users.push(jsonData.data);
                    break;
                case "leave":
                    users.filter((val, i, arr) => val != jsonData.data);
                    break;
                case "pause":
                    vid.pause();
                    break;
                case "play":
                    vid.play();
                    break;
                case "seek":
                    vid.currentTime = jsonData.data;
                    break;
                case "vid":
                    let src = jsonData.data;
                    console.log(src);

                    if (document.contains(document.getElementById("vid-src"))) {
                        document.getElementById("vid-src").remove;
                    }

                    var source = document.createElement("source");
                    source.setAttribute(
                        "src",
                        `https://small-bonus-7f1f.manfromth3m0on.workers.dev/?${src.video}`
                    );
                    source.setAttribute("id", "vid-src");
                    vid.appendChild(source);
                    break;
            }
        });

        vid.addEventListener("pause", (event) => {
            console.log("Paused");
            ws.send(JSON.stringify({ type: "pause", data: vid.currentTime }));
        });

        vid.addEventListener("play", (event) => {
            console.log("Playing");
            ws.send(JSON.stringify({ type: "play", data: vid.currentTime }));
        });

        vid.addEventListener("seeked", (event) => {
            console.log(`Seeked to ${vid.currentTime}`);
            ws.send(JSON.stringify({ type: "seek", datA: vid.currentTime }));
        });
    });
</script>

<div class="room">
    <h1>Room: {name}</h1>
    <div class="panes">
        <div class="vidpanel">
            <!-- svelte-ignore a11y-media-has-caption -->
            <video id="vid" controls />
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
                <button on:click={() => seek("back")}> &#60; </button>
                <button on:click={() => seek("pause")}> || </button>
                <button on:click={() => seek("forward")}> &#62; </button>
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
