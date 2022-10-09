'use strict';

let invalidUrl = false;

const handleShortenerKeypress = (event) => {
	if (event.keyCode === 13) {
		handleShortenerClick();
	}
}

/**
 * Handles shortener button click.
 */
const handleShortenerClick = async () => {
	const result = document.getElementById("result");
	const loader = document.getElementById("loading");
	const urlInput = document.getElementById("urlInput");

	loader.style.display = "block";
	result.style.display = "none";

	invalidUrl = false

	const { newUrl } = await getShortenUrl(urlInput.value);

	// Remove the loader from the screen
	loader.style.display = "none";
	result.style.display = "block";

	urlInput.value = '';

	if (!newUrl) {
		result.querySelector('#error').textContent = 'This url is invalid..';
		result.querySelector('#text').textContent = '';
		result.querySelector('#action').classList = 'd-none';
		invalidUrl = true;
		return;
	}

	result.querySelector('#error').textContent = '';
	result.querySelector('#text').textContent = window.location.href + newUrl;
	result.querySelector('#action').classList.replace('d-none', 'd-block');

	copyUrl()
};

/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
const getShortenUrl = async (originalUrl) => {
	let result;
	try {
		result = await fetch('/api/v1/shortener', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ originalUrl })
		});
	} catch (err) {
		return null;
	}
	return result.json()
};

/**
 * Copy link to clipboard.
 */

const copyUrl = () => {
	if (invalidUrl) {
		return;
	}

	const result = document.querySelector("#result #text");
	navigator.clipboard.writeText(result.textContent);
	toastAlert();
};

const toastAlert = (timeoutInMiliseconds = 2000) => {
	const urlAlert = document.getElementById("urlAlert");

	urlAlert.classList.add('fade-in');
	urlAlert.classList.remove('collapse');

	setTimeout(() => {
		urlAlert.classList.remove('fade-in');
		urlAlert.classList.add('fade-out');

		setTimeout(() => {
			urlAlert.classList.add('collapse');
			urlAlert.classList.remove('fade-out');
		}, 500);
	}, timeoutInMiliseconds);
}

// Open link in a new window/tab.
const openLink = () => {
	const text = document.querySelector('#result #text').textContent;
	window.open(text, '_blank');
};

function lightMode(){
	document.getElementById('sun').style.display='none';
	document.getElementById('moon').style.display='block';
	localStorage.setItem('theme','light');
	document.body.style.background='#c1beff'
}
function darkMode(){
	document.getElementById('moon').style.display='none';
	document.getElementById('sun').style.display='block';
	localStorage.setItem('theme','dark');
	document.body.style.background='#141414';

};
window.onload=()=>{
	const localstoragetheme = localStorage.getItem("theme");
        if (localstoragetheme === "dark" && localstoragetheme !== null) {
		darkMode();
	}
	else{
		lightMode();
	}

}