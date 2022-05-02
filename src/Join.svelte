<script>
  import { useNavigate } from "svelte-navigator";
  import { username } from "./store.js";

  const navigate = useNavigate();
  let roomName = "";
  let usernameTmp = "";
</script>

<div class="container">
  <div>
    <label for="room-id">Room Name</label>
    <input bind:value={roomName} id="room-id" type="text" />
    <label for="username">Username</label>
    <input bind:value={usernameTmp} id="username" type="text" />
    <br />
    <button
      on:click={() => {
        console.log(`setting username to ${usernameTmp}`);
        username.set(usernameTmp);
        navigate("/room/" + roomName);
      }}>Go!</button
    >
  </div>
</div>
