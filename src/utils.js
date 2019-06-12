// utils.js

function get_random_int(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function format_label(str) {
    str = str.replace("_", " ");
    return capitalize(str);
}

function str_hash(str) {
  let hash = 0
  for (let i=0, len=str.length; i < len; ++i) {
    let chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32 bit integer
  }
  return hash.toString();
}

function rnd_str(length) {
	function rnd_chr() {
		const i = Math.floor(97 + Math.random() * 26);
		return String.fromCharCode(i);
	}
	
	let s = '';
	for (let i=0; i < length; ++i) {
		s += rnd_chr();
	}
	
	return s;
}

export {
  get_random_int,
  capitalize,
  format_label,
  str_hash,
	rnd_str,
};