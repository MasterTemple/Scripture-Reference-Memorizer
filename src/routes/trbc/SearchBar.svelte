<script>
	import { input, page, reload } from "./stores";

	function checkForEnter(e) {
		if (e.key === "Enter") reload();
	}

	async function newSearch() {
		document.getElementById("input").focus();
		page.set(1);
		reload();
	}
</script>

<div class="wrap">
	<div class="row searchbar search">
		<input
			type="text"
			class="searchTerm"
			id="input"
			autocomplete="off"
			placeholder="Search anything ever said..."
			on:keydown={checkForEnter}
			bind:value={$input}
		/>
		<button id="search-button" class="searchButton" on:click={newSearch}>
			Search
		</button>
	</div>
</div>

<style>
	* {
		font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
		color: white;
		/* background-color: var(--dark3); */
	}
	.searchbar {
		justify-content: center;
		margin: 1rem;
	}

	#input {
		padding: 1rem;
		width: 40vw;
		font-size: 18px;
		background-color: var(--dark2);
		outline: none;
		border: 2px solid var(--dark2);
		border-radius: 8px;
		filter: drop-shadow(0 0 0.2em var(--black));
		caret-color: white;
	}

	#search-button {
		margin: 0 1rem;
		padding: 1rem;
		font-size: 18px;
		align-self: center;
		border: 1px solid var(--dark2);
		border-radius: 8px;
		background-color: var(--dark1);
	}
	#search-button:hover {
		color: var(--accent);
		border: 1px solid var(--accent);
		filter: drop-shadow(0 0 0.2em var(--accent));
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	#input:active,
	input:active,
	#input:focus,
	input:focus {
		border: 1px solid var(--accent);
		/* cursor: white; */
	}
	#input:-webkit-autofill,
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus,
	input:-webkit-autofill:active {
		-webkit-box-shadow: 0 0 0 30px var(--dark2) inset !important;
		outline: none;
		border: 1px solid var(--accent);
		/* cursor: white; */
	}

	#input:-webkit-autofill,
	input:-webkit-autofill {
		-webkit-text-fill-color: white !important;
		/* outline: none; */
		border: 1px solid var(--accent);
		border-radius: 8px;
		/* cursor: white; */
	}
	.row {
		display: flex;
		flex-direction: row;
	}
</style>
