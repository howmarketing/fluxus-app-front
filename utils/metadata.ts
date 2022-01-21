import fluxusIcon from '@assets/app/fluxus-icon.svg';

const icons: { [tokenId: string]: string } = {
	'wrap.near': 'https://i.postimg.cc/4xx2KRxt/wNEAR.png',
	'wrap.testnet': 'https://i.postimg.cc/4xx2KRxt/wNEAR.png',
	fluxus: fluxusIcon,
	'fluxustest.leopollum.testnet': fluxusIcon,
	'unit-test-token1.testnet': fluxusIcon,
	'unit-test-token2.testnet': fluxusIcon,
	'unit-test-token3.testnet': fluxusIcon,
	'unit-test-token4.testnet': fluxusIcon,
	'rft.tokenfactory.testnet':
		"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='16 24 248 248' style='background: %23000'%3E%3Cpath d='M164,164v52h52Zm-45-45,20.4,20.4,20.6-20.6V81H119Zm0,18.39V216h41V137.19l-20.6,20.6ZM166.5,81H164v33.81l26.16-26.17A40.29,40.29,0,0,0,166.5,81ZM72,153.19V216h43V133.4l-11.6-11.61Zm0-18.38,31.4-31.4L115,115V81H72ZM207,121.5h0a40.29,40.29,0,0,0-7.64-23.66L164,133.19V162h2.5A40.5,40.5,0,0,0,207,121.5Z' fill='%23fff'/%3E%3Cpath d='M189 72l27 27V72h-27z' fill='%2300c08b'/%3E%3C/svg%3E%0A",
	'6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
	'berryclub.ek.near': 'https://i.postimg.cc/j263fsf6/banana.png',
	'banana.ft-fin.testnet': 'https://i.postimg.cc/j263fsf6/banana.png',
	'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
	'1f9840a85d5af5bf1d1762f925bdaddc4201f984.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
	'514910771af9ca656af840dff83e8264ecf986ca.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
	'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
	'2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png',
	'7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png',
	'a0b73e1ff0b80914ab6fe0444e65848c4c34450b.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/3635.png',
	'50d1c9771902476076ecfc8b2a83ad6b9355a4c9.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/4195.png',
	'4fabb145d64652a948d72533023f6e7a623c7c53.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
	'6f259637dcd74c767781e37bc6133cd6a68aa161.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/2502.png',
	'6b3595068778dd592e39a122f4f5a5cf09c90fe2.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/6758.png',
	'c011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/2586.png',
	'c944e90c64b2c07662a292be6244bdf05cda44a7.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png',
	'9f8f72aa9304c8b593d555f12ef6589cc3a579a2.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png',
	'0bc529c00c6401aef6d220be8c6ea1667f6ad93e.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/5864.png',
	'c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png',
	'0316eb71485b0ab14103307bf65a021042c6d380.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/6941.png',
	'111111111117dc0aa78b770fa6a738034120c302.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/8104.png',
	'f5cfbc74057c610c8ef151a439252680ac68c6dc.factory.bridge.near': 'https://i.postimg.cc/NMJB3MF8/55sGoBm.png',
	'de30da39c46104798bb5aa3fe8b9e0e1f348163f.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/10052.png',
	'a4ef4b0b23c1fc81d3f9ecf93510e64f58a4a016.factory.bridge.near':
		'https://s2.coinmarketcap.com/static/img/coins/64x64/4222.png',
	'token.cheddar.near': 'https://i.postimg.cc/xk1vJC6x/cheddar.png',
	'farm.berryclub.ek.near': 'https://i.postimg.cc/TLyn0sMn/cucumber.png',
	'd9c2d319cd7e6177336b0a9c93c21cb48d84fb54.factory.bridge.near': 'https://i.postimg.cc/jwGPFhtm/HAPI.png',
};

export default icons;
