/**
 * This file is autogenerated by Create Fhenix DApp.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  412346: {
    Counter: {
      address: "0x88d9076cBe1445ad13F63D3b44d95e07582fFe82",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "ECDSAInvalidSignature",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "length",
              type: "uint256",
            },
          ],
          name: "ECDSAInvalidSignatureLength",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
            },
          ],
          name: "ECDSAInvalidSignatureS",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidShortString",
          type: "error",
        },
        {
          inputs: [],
          name: "SignerNotMessageSender",
          type: "error",
        },
        {
          inputs: [],
          name: "SignerNotOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "str",
              type: "string",
            },
          ],
          name: "StringTooLong",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [],
          name: "EIP712DomainChanged",
          type: "event",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
                {
                  internalType: "int32",
                  name: "securityZone",
                  type: "int32",
                },
              ],
              internalType: "struct inEuint32",
              name: "encryptedValue",
              type: "tuple",
            },
          ],
          name: "add",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "eip712Domain",
          outputs: [
            {
              internalType: "bytes1",
              name: "fields",
              type: "bytes1",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "version",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "chainId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "verifyingContract",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "salt",
              type: "bytes32",
            },
            {
              internalType: "uint256[]",
              name: "extensions",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getCounter",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "bytes32",
                  name: "publicKey",
                  type: "bytes32",
                },
                {
                  internalType: "bytes",
                  name: "signature",
                  type: "bytes",
                },
              ],
              internalType: "struct Permission",
              name: "permission",
              type: "tuple",
            },
          ],
          name: "getCounterPermit",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "bytes32",
                  name: "publicKey",
                  type: "bytes32",
                },
                {
                  internalType: "bytes",
                  name: "signature",
                  type: "bytes",
                },
              ],
              internalType: "struct Permission",
              name: "permission",
              type: "tuple",
            },
          ],
          name: "getCounterPermitSealed",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "data",
                  type: "string",
                },
                {
                  internalType: "uint8",
                  name: "utype",
                  type: "uint8",
                },
              ],
              internalType: "struct SealedUint",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {
        eip712Domain: "@fhenixprotocol/contracts/access/Permissioned.sol",
      },
    },
    FHEKuhnPoker: {
      address: "0xc172fc2df2E4841DFf0e2A8395318E51dB031053",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "ECDSAInvalidSignature",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "length",
              type: "uint256",
            },
          ],
          name: "ECDSAInvalidSignatureLength",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
            },
          ],
          name: "ECDSAInvalidSignatureS",
          type: "error",
        },
        {
          inputs: [],
          name: "GameEnded",
          type: "error",
        },
        {
          inputs: [],
          name: "GameNotStarted",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidAction",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidGame",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidPlayerB",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidShortString",
          type: "error",
        },
        {
          inputs: [],
          name: "NotEnoughChips",
          type: "error",
        },
        {
          inputs: [],
          name: "NotPlayerInGame",
          type: "error",
        },
        {
          inputs: [],
          name: "NotYourTurn",
          type: "error",
        },
        {
          inputs: [],
          name: "SignerNotMessageSender",
          type: "error",
        },
        {
          inputs: [],
          name: "SignerNotOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "str",
              type: "string",
            },
          ],
          name: "StringTooLong",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "player",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "gid",
              type: "uint256",
            },
          ],
          name: "ChipTaken",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [],
          name: "EIP712DomainChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "playerB",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "gid",
              type: "uint256",
            },
          ],
          name: "GameAccepted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "playerA",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "gid",
              type: "uint256",
            },
          ],
          name: "GameCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "player",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "gid",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "enum Action",
              name: "action",
              type: "uint8",
            },
          ],
          name: "PerformedGameAction",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "chips",
              type: "uint256",
            },
          ],
          name: "PlayerDealtIn",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "winner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "gid",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "pot",
              type: "uint256",
            },
          ],
          name: "WonByFold",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "winner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "gid",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "pot",
              type: "uint256",
            },
          ],
          name: "WonByShowdown",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "chips",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "createGame",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "chipCount",
              type: "uint256",
            },
          ],
          name: "dealMeIn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "eip712Domain",
          outputs: [
            {
              internalType: "bytes1",
              name: "fields",
              type: "bytes1",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "version",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "chainId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "verifyingContract",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "salt",
              type: "bytes32",
            },
            {
              internalType: "uint256[]",
              name: "extensions",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "games",
          outputs: [
            {
              internalType: "uint256",
              name: "gid",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "playerA",
              type: "address",
            },
            {
              internalType: "address",
              name: "playerB",
              type: "address",
            },
            {
              internalType: "bool",
              name: "accepted",
              type: "bool",
            },
            {
              internalType: "uint8",
              name: "pot",
              type: "uint8",
            },
            {
              internalType: "uint8",
              name: "startingPlayer",
              type: "uint8",
            },
            {
              internalType: "euint8",
              name: "eCardA",
              type: "uint256",
            },
            {
              internalType: "euint8",
              name: "eCardB",
              type: "uint256",
            },
            {
              internalType: "enum Action",
              name: "action1",
              type: "uint8",
            },
            {
              internalType: "enum Action",
              name: "action2",
              type: "uint8",
            },
            {
              internalType: "enum Action",
              name: "action3",
              type: "uint8",
            },
            {
              components: [
                {
                  internalType: "uint256",
                  name: "gid",
                  type: "uint256",
                },
                {
                  internalType: "uint8",
                  name: "cardA",
                  type: "uint8",
                },
                {
                  internalType: "uint8",
                  name: "cardB",
                  type: "uint8",
                },
                {
                  internalType: "address",
                  name: "winner",
                  type: "address",
                },
                {
                  internalType: "enum Outcome",
                  name: "outcome",
                  type: "uint8",
                },
              ],
              internalType: "struct GameOutcome",
              name: "outcome",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_gid",
              type: "uint256",
            },
          ],
          name: "getGame",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "gid",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "playerA",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "playerB",
                  type: "address",
                },
                {
                  internalType: "bool",
                  name: "accepted",
                  type: "bool",
                },
                {
                  internalType: "uint8",
                  name: "pot",
                  type: "uint8",
                },
                {
                  internalType: "uint8",
                  name: "startingPlayer",
                  type: "uint8",
                },
                {
                  internalType: "euint8",
                  name: "eCardA",
                  type: "uint256",
                },
                {
                  internalType: "euint8",
                  name: "eCardB",
                  type: "uint256",
                },
                {
                  internalType: "enum Action",
                  name: "action1",
                  type: "uint8",
                },
                {
                  internalType: "enum Action",
                  name: "action2",
                  type: "uint8",
                },
                {
                  internalType: "enum Action",
                  name: "action3",
                  type: "uint8",
                },
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "gid",
                      type: "uint256",
                    },
                    {
                      internalType: "uint8",
                      name: "cardA",
                      type: "uint8",
                    },
                    {
                      internalType: "uint8",
                      name: "cardB",
                      type: "uint8",
                    },
                    {
                      internalType: "address",
                      name: "winner",
                      type: "address",
                    },
                    {
                      internalType: "enum Outcome",
                      name: "outcome",
                      type: "uint8",
                    },
                  ],
                  internalType: "struct GameOutcome",
                  name: "outcome",
                  type: "tuple",
                },
              ],
              internalType: "struct Game",
              name: "game",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "bytes32",
                  name: "publicKey",
                  type: "bytes32",
                },
                {
                  internalType: "bytes",
                  name: "signature",
                  type: "bytes",
                },
              ],
              internalType: "struct Permission",
              name: "permission",
              type: "tuple",
            },
            {
              internalType: "uint256",
              name: "_gid",
              type: "uint256",
            },
          ],
          name: "getGameCard",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "data",
                  type: "string",
                },
                {
                  internalType: "uint8",
                  name: "utype",
                  type: "uint8",
                },
              ],
              internalType: "struct SealedUint",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "gid",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_gid",
              type: "uint256",
            },
          ],
          name: "joinGame",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_gid",
              type: "uint256",
            },
            {
              internalType: "enum Action",
              name: "action",
              type: "uint8",
            },
          ],
          name: "performAction",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {
        eip712Domain: "@fhenixprotocol/contracts/access/Permissioned.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
