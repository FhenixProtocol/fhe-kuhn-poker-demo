// SPDX-License-Identifier: MIT

pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
import "./FHETypedSealed.sol";
import { Permissioned, Permission } from "@fhenixprotocol/contracts/access/Permissioned.sol";

contract Counter is Permissioned {
	using TypedBindingsEuint32 for euint32;

	euint32 private counter;
	address public owner;

	constructor() {
		owner = msg.sender;
	}

	function add(inEuint32 calldata encryptedValue) public {
		euint32 value = FHE.asEuint32(encryptedValue);
		counter = counter + value;
	}

	function getCounter() public view returns (uint256) {
		return FHE.decrypt(counter);
	}

	function getCounterPermit(
		Permission memory permission
	) public view onlySender(permission) returns (uint256) {
		return FHE.decrypt(counter);
	}

	function getCounterPermitSealed(
		Permission memory permission
	) public view onlySender(permission) returns (SealedUint memory) {
		return counter.sealTyped(permission.publicKey);
	}
}
