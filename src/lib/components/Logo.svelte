<script lang="ts">
	const frames = [
		'⣫tipple',
		'⠎tipple',
		'⠎⠞ipple',
		'⠎⠞⠊pple',
		'⠎⠞⠊⠏ple',
		'⠎⠞⠊⠏⠏le',
		'⠎⠞⠊⠏⠏⠇e',
		'⠎⠞⠊⠏⠏⠇⠑',
		'⠎⠞⠊⠏⠏⠇⠑',
		'⠎⠞⠊⠏⠏⠇⠑',
		'⣫⠞⠊⠏⠏⠇⠑',
		'⣫t⠊⠏⠏⠇⠑',
		'⣫ti⠏⠏⠇⠑',
		'⣫tip⠏⠇⠑',
		'⣫tipp⠇⠑',
		'⣫tippl⠑'
	];
	let index = $state(0);
	let isPlaying = false;
	let intervalId: number;

	function playAnimation() {
		if (isPlaying) return;
		isPlaying = true;
		intervalId = setInterval(() => {
			if (index == frames.length - 1) {
				clearInterval(intervalId);
				index = 0;
				isPlaying = false;
			} else {
				index++;
			}
		}, 80);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<a
	class="transition-colors-default hocus:text-accent flex items-center text-xl tracking-widest outline-none"
	href={import.meta.env.BASE_URL}
	onmouseenter={playAnimation}
	aria-label="Stipple"
>
	<span aria-hidden="true">{frames[index]}</span>
</a>
