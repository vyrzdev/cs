<script>
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();
    let roomName = "";
</script>

<div class="container">
    <div>
        <label for="room-id">Room Name</label>
        <input bind:value="{roomName}" id="room-id" type="text" />
        <br />
        <button on:click="{() => navigate('/room/'+roomName)}">Go!</button>
    </div>
</div>
