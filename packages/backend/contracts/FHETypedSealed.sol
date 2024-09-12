// SPDX-License-Identifier: MIT

pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
import { Permissioned, Permission } from "@fhenixprotocol/contracts/access/Permissioned.sol";

struct SealedBool {
	string data;
	uint8 utype;
}

struct SealedUint {
	string data;
	uint8 utype;
}

struct SealedAddress {
	string data;
	uint8 utype;
}

library TypedBindingsEbool {
	function sealTyped(
		ebool value,
		bytes32 publicKey
	) internal pure returns (SealedBool memory) {
		return
			SealedBool({
				data: FHE.sealoutput(value, publicKey),
				utype: Common.EBOOL_TFHE
			});
	}
}

library TypedBindingsEuint8 {
	function sealTyped(
		euint8 value,
		bytes32 publicKey
	) internal pure returns (SealedUint memory) {
		return
			SealedUint({
				data: FHE.sealoutput(value, publicKey),
				utype: Common.EUINT8_TFHE
			});
	}
}

library TypedBindingsEuint16 {
	function sealTyped(
		euint16 value,
		bytes32 publicKey
	) internal pure returns (SealedUint memory) {
		return
			SealedUint({
				data: FHE.sealoutput(value, publicKey),
				utype: Common.EUINT16_TFHE
			});
	}
}

library TypedBindingsEuint32 {
	function sealTyped(
		euint32 value,
		bytes32 publicKey
	) internal pure returns (SealedUint memory) {
		return
			SealedUint({
				data: FHE.sealoutput(value, publicKey),
				utype: Common.EUINT32_TFHE
			});
	}
}

library TypedBindingsEuint64 {
	function sealTyped(
		euint64 value,
		bytes32 publicKey
	) internal pure returns (SealedUint memory) {
		return
			SealedUint({
				data: FHE.sealoutput(value, publicKey),
				utype: Common.EUINT64_TFHE
			});
	}
}

library TypedBindingsEuint128 {
	function sealTyped(
		euint128 value,
		bytes32 publicKey
	) internal pure returns (SealedUint memory) {
		return
			SealedUint({
				data: FHE.sealoutput(value, publicKey),
				utype: Common.EUINT128_TFHE
			});
	}
}

library TypedBindingsEuint256 {
	function sealTyped(
		euint256 value,
		bytes32 publicKey
	) internal pure returns (SealedUint memory) {
		return
			SealedUint({
				data: FHE.sealoutput(value, publicKey),
				utype: Common.EUINT256_TFHE
			});
	}
}

library TypedBindingsEaddress {
	function sealTyped(
		eaddress value,
		bytes32 publicKey
	) internal pure returns (SealedAddress memory) {
		return
			SealedAddress({
				data: FHE.sealoutput(value, publicKey),
				utype: Common.EADDRESS_TFHE
			});
	}
}
