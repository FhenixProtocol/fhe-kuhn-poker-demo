# 🏗 FHENIX KUHN POKER

Fhenix Kuhn Poker is a POC demonstrating on-chain randomness using Fhenix's new `random` functionality.

This dApp is currently in a WIP state, and will be released in full after the deployment of the Fhenix Nitrogen testnet, which introduces the randomness functionality.

Additionally, this repo includes utilities for interacting with the fhenix blockchain,
such as `useFhenixScaffoldContractRead` which automatically injects Fhenix permissions into read calls and decrypts sealed outputs, and `useFhenixScaffoldContractWrite` which automatically encrypts input variables before they are sent to the chain to be consumed as `inEuint` varieties.

Video demonstration of FHE kuhn poker:
<video controls src="FheKuhnPoker_v2.mp4" title="Title"></video>
