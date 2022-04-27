<script>
    import { onMount } from "svelte";

    export let name;
    let ws;
    let vid;

    onMount(() => {
        vid = document.getElementById("vid");
        ws = new WebSocket(`ws://localhost:3000/room/${name}`);
        ws.addEventListener("open", function (event) {
            ws.send("Hello Server!");
        });

        ws.addEventListener("message", function (event) {
            let src = JSON.parse(event.data);
            console.log(src);
            var source = document.createElement("source");
            source.setAttribute(
                "src",
                `https://small-bonus-7f1f.manfromth3m0on.workers.dev/?${src.video}`
            );
            vid.appendChild(source);
        });
        vid.addEventListener("pause", (event) => {
            console.log("Paused");
        });
        vid.addEventListener("play", (event) => {
            console.log("Playing");
        });
        vid.addEventListener("seeked", (event) => {
            console.log(`Seeked to ${vid.currentTime}`);
        });
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
            <video id="vid" controls />
        </div>
        <div class="controls">
            <h1>controls</h1>
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
