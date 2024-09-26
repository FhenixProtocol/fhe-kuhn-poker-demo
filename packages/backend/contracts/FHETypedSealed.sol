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

library FHETypedSealedEbool {
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

library FHETypedSealedEuint8 {
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

library FHETypedSealedEuint16 {
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

library FHETypedSealedEuint32 {
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

library FHETypedSealedEuint64 {
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

library FHETypedSealedEuint128 {
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

library FHETypedSealedEuint256 {
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

library FHETypedSealedEaddress {
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
