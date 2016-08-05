const POKEMON_URL = 'http://www.pokemon.com/'
const POKEMON_SSO_MATCH_PATTERN = 'https://sso.pokemon.com/*'
const POKEMON_MAP_URL = 'http://localhost:3000'
const ALL_METHODS = 'GET, PUT, POST, DELETE, HEAD, OPTIONS'
const ACCESS_CONTROL_EXPOSE_HEADERS = ''
let ACCESS_CONTROL_REQUEST_HEADERS = ''

function requestListener(details) {
  const originHeader = details.requestHeaders.find(header => header.name.toLowerCase() === 'origin')

  if(originHeader) {
    originHeader.value = POKEMON_URL
  } else {
    details.requestHeaders.push({
      name: 'Origin',
      value: POKEMON_URL
    })
  }

  const userAgentHeader = details.requestHeaders.find(header => header.name.toLowerCase() === 'user-agent')

  if(userAgentHeader) {
    userAgentHeader.value = 'niantic'
  } else {
    details.requestHeaders.push({
      name: 'User-Agent',
      value: 'niantic'
    })
  }

  const accessControlRequestHeadersHeader = details.requestHeaders.find(header => header.name.toLowerCase() === 'access-control-request-headers')

  if(accessControlRequestHeadersHeader) {
    ACCESS_CONTROL_REQUEST_HEADERS = accessControlRequestHeadersHeader.value
  }

	return {requestHeaders: details.requestHeaders};
};

function responseListener(details){
    const accessControlAllowOriginHeader = details.responseHeaders.find(header => header.name.toLowerCase() === 'access-control-allow-origin')

    if(accessControlAllowOriginHeader) {
      accessControlAllowOriginHeader.value = POKEMON_MAP_URL
    } else {
      details.responseHeaders.push({
				name: 'Access-Control-Allow-Origin',
				value: POKEMON_MAP_URL
			})
    }

		if (ACCESS_CONTROL_REQUEST_HEADERS) {
			details.responseHeaders.push({name: 'Access-Control-Allow-Headers', value: ACCESS_CONTROL_REQUEST_HEADERS});
		}

		if (ACCESS_CONTROL_EXPOSE_HEADERS) {
		    details.responseHeaders.push({name: 'Access-Control-Expose-Headers', value: ACCESS_CONTROL_EXPOSE_HEADERS});
    }

		details.responseHeaders.push({name: 'Access-Control-Allow-Methods', value: ALL_METHODS});

		return {responseHeaders: details.responseHeaders};
};

/*On install*/
chrome.runtime.onInstalled.addListener(function(){
	reload();
});

/*Reload settings*/
function reload() {
	/*Remove Listeners*/
	chrome.webRequest.onHeadersReceived.removeListener(responseListener);
	chrome.webRequest.onBeforeSendHeaders.removeListener(requestListener);

	/*Add Listeners*/
	chrome.webRequest.onHeadersReceived.addListener(responseListener, {
		urls: [POKEMON_SSO_MATCH_PATTERN]
	},['blocking', 'responseHeaders']);

	chrome.webRequest.onBeforeSendHeaders.addListener(requestListener, {
		urls: [POKEMON_SSO_MATCH_PATTERN]
	},['blocking', 'requestHeaders']);
}
