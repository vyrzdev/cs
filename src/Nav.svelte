<script>
    import { Link } from "svelte-navigator";
</script>

<nav>
    <div class="icon">
        <h1>CS</h1>
    </div>
    <div class="links">
        <Link to="create">Create Room</Link>
        <Link to="join">Join Room</Link>
        <Link to="about">About</Link>
    </div>
</nav>

<style>
    nav {
        box-shadow: 0px 3px 5px #aaaaaa;
        display: flex;
        justify-content: space-between;
        padding-left: 20px;
        padding-right: 20px;
    }
    .links {
        margin-top: auto;
        margin-bottom: auto;
    }
</style>
