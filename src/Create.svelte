<script>
  import { useNavigate } from "svelte-navigator";
  import { username } from "./store";

  const navigate = useNavigate();
  let req = {
    board_sn: "",
    thread_id: "",
    room_name: "",
    username: "",
  };

  function createRoom() {
    username.set(req.username);
    console.log(req);
    fetch("http://localhost:3000/create-room", {
      method: "POST",
      body: JSON.stringify(req),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("req error");
        }
        return resp.json();
      })
      .then((data) => {
        console.log(`room to redirect to ${data.room}`);
        navigate(`/room/${data.room}`);
      });
  }
</script>

<div class="container">
  <div class="form">
    <label for="board-sn">Board Shortname</label>
    <input bind:value={req.board_sn} id="board-sn" type="text" />
    <label for="thread-id">Thread ID</label>
    <input bind:value={req.thread_id} id="thread-id" type="text" />
    <label for="room-name">Room Name</label>
    <input bind:value={req.room_name} id="room-name" type="text" />
    <label for="user-name">User Name</label>
    <input bind:value={req.username} id="user-name" type="text" />
    <br />
    <button on:click={createRoom}>Start Room</button>
  </div>
</div>
