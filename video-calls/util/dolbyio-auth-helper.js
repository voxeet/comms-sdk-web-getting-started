const dolbyio = {};

/**
 * Open a modal to allow user to paste in a token. This helper
 * only works with the starter project that has the elements
 * defined.
 *
 * @returns token (string)
 */
dolbyio.tokenPrompt = () => {
	document.getElementById('btn-token').onclick = async () => {
		modal.hide();

		const token = document.getElementById('input-token').value;
		const params = new URLSearchParams(window.location.search);
		params.set("token", token);
		window.location.search = params.toString();

		return token;
	};

	const modalElement = document.getElementById('token-prompt');
	const modal = new bootstrap.Modal(modalElement, {
		backdrop: 'static',
		keyboard: false,
		focus: true
	});
	modal.show();
}

/**
 * Returns an access token for initializing the Dolby.io Communications
 * Web SDK. This method is looking for a token to be provided as a
 * querytring parameter or will prompt with a modal dialog for manual
 * entry.
 *
 * @returns token (string)
 *
 * This function will help provide a token that is given to the application
 * as a querystring parameter.
 */
dolbyio.getAccessToken = () => {
	// For an insecure but quick test, you can return a hard-coded
	// access token during development.
	// return '<REPLACE-WITH-TEMPORARY-ACCESS-TOKEN>';

	const queryParams = new URLSearchParams(window.location.search);

	console.group('Dolby.io Client Access Token');
	const accessToken = queryParams.get('token');

	if (!accessToken) {
		const inputToken = dolbyio.tokenPrompt();
		console.log(inputToken);
	}

	try {
		const token = accessToken.split('.')[1];
		const jwt = JSON.parse(window.atob(token));
		const expiration = new Date(jwt.exp * 1000);

		console.log(`Token: ${accessToken}`);
		console.log(`Expires: ${expiration}`);
		if (expiration.getTime() <= new Date().getTime()) {
			console.log("This token has expired. Fetch a new one from the Dolby.io dashboard.");
		}
	} catch(error) {
		console.error(error);
	}
	console.groupEnd();

	return accessToken;
};

