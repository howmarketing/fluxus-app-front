'use strict';
const withImages = require('next-images');
module.exports = withImages({
	reactStrictMode: true,
	compress: false,
	esModule: true,
	withImages: true,
	PluginArray: [['styled-components', { ssr: true }], 'inline-react-svg'],
	env: {
		X_REF_FI_CONTRACT_ID: 'exchange.ref-dev.testnet',
		X_REF_FARM_CONTRACT_ID: 'farm110.ref-dev.testnet',
		X_REF_TOKEN_ID: 'token.ref-finance.testnet',
		DEBUG_LOG: 'false',
		HTTPS: true,
		SSL_CRT_FILE: "./cert.pem",
		SSL_KEY_FILE: "./key.pem",
	},
	// experimental: { optimizeImages: true },

	webpack(config, options) {
		return config;
	},
});
