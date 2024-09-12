import { DEncryptedInputTypes, DSealedOutputTypes, DFhenixPermission } from "~~/utils/fhenixUtilsTypes";

declare module "viem/node_modules/abitype" {
  export interface Config {
    AddressType: AddressType;
  }
}

declare module "abitype" {
  export interface Register {
    AddressType: AddressType;
    structTypeMatches: {
      inBool: DEncryptedInputTypes["bool"];
      inEuint8: DEncryptedInputTypes["uint8"];
      inEuint16: DEncryptedInputTypes["uint16"];
      inEuint32: DEncryptedInputTypes["uint32"];
      inEuint64: DEncryptedInputTypes["uint64"];
      inEuint128: DEncryptedInputTypes["uint128"];
      inEuint256: DEncryptedInputTypes["uint256"];
      inAddress: DEncryptedInputTypes["address"];

      Permission: DFhenixPermission;

      SealedBool: DSealedOutputTypes["bool"];
      SealedUint: DSealedOutputTypes["uint"];
      SealedAddress: DSealedOutputTypes["address"];
    };
  }
}
