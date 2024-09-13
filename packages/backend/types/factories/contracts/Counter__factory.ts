/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { Counter, CounterInterface } from "../../contracts/Counter";

const _abi = [
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
] as const;

const _bytecode =
  "0x6101606040523480156200001257600080fd5b506040518060400160405280601181526020017f4668656e6978205065726d697373696f6e0000000000000000000000000000008152506040518060400160405280600381526020017f312e30000000000000000000000000000000000000000000000000000000000081525062000095600083620001ae60201b90919060201c565b6101208181525050620000b3600182620001ae60201b90919060201c565b6101408181525050818051906020012060e08181525050808051906020012061010081815250504660a08181525050620000f26200020660201b60201c565b608081815250503073ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff168152505050506200014b672f281af82904282160c01b6200026360201b60201c565b62000167678db2d4f0c3c5bbad60c01b6200026360201b60201c565b33600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555062000861565b6000602083511015620001d457620001cc836200026660201b60201c565b905062000200565b82620001e683620002d360201b60201c565b6000019081620001f7919062000557565b5060ff60001b90505b92915050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60e05161010051463060405160200162000248959493929190620006af565b60405160208183030381529060405280519060200120905090565b50565b600080829050601f81511115620002b657826040517f305a27a9000000000000000000000000000000000000000000000000000000008152600401620002ad91906200079b565b60405180910390fd5b805181620002c490620007f1565b60001c1760001b915050919050565b6000819050919050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200035f57607f821691505b60208210810362000375576200037462000317565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620003df7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620003a0565b620003eb8683620003a0565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000438620004326200042c8462000403565b6200040d565b62000403565b9050919050565b6000819050919050565b620004548362000417565b6200046c62000463826200043f565b848454620003ad565b825550505050565b600090565b6200048362000474565b6200049081848462000449565b505050565b5b81811015620004b857620004ac60008262000479565b60018101905062000496565b5050565b601f8211156200050757620004d1816200037b565b620004dc8462000390565b81016020851015620004ec578190505b62000504620004fb8562000390565b83018262000495565b50505b505050565b600082821c905092915050565b60006200052c600019846008026200050c565b1980831691505092915050565b600062000547838362000519565b9150826002028217905092915050565b6200056282620002dd565b67ffffffffffffffff8111156200057e576200057d620002e8565b5b6200058a825462000346565b62000597828285620004bc565b600060209050601f831160018114620005cf5760008415620005ba578287015190505b620005c6858262000539565b86555062000636565b601f198416620005df866200037b565b60005b828110156200060957848901518255600182019150602085019450602081019050620005e2565b8683101562000629578489015162000625601f89168262000519565b8355505b6001600288020188555050505b505050505050565b6000819050919050565b62000653816200063e565b82525050565b620006648162000403565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000697826200066a565b9050919050565b620006a9816200068a565b82525050565b600060a082019050620006c6600083018862000648565b620006d5602083018762000648565b620006e4604083018662000648565b620006f3606083018562000659565b6200070260808301846200069e565b9695505050505050565b600082825260208201905092915050565b60005b838110156200073d57808201518184015260208101905062000720565b60008484015250505050565b6000601f19601f8301169050919050565b60006200076782620002dd565b6200077381856200070c565b9350620007858185602086016200071d565b620007908162000749565b840191505092915050565b60006020820190508181036000830152620007b781846200075a565b905092915050565b600081519050919050565b6000819050602082019050919050565b6000620007e882516200063e565b80915050919050565b6000620007fe82620007bf565b826200080a84620007ca565b90506200081781620007da565b925060208210156200085a57620008557fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83602003600802620003a0565b831692505b5050919050565b60805160a05160c05160e051610100516101205161014051611dc5620008bc60003960006106680152600061062d01526000610c4f01526000610c2e0152600061070c015260006107620152600061078b0152611dc56000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80635ef89f33146100675780637ec956541461009757806384b0196e146100b35780638ada066e146100d75780638da5cb5b146100f5578063ab07a95614610113575b600080fd5b610081600480360381019061007c91906113ac565b610143565b60405161008e919061140e565b60405180910390f35b6100b160048036038101906100ac919061144d565b610295565b005b6100bb610311565b6040516100ce979695949392919061165e565b60405180910390f35b6100df6103bb565b6040516100ec919061140e565b60405180910390f35b6100fd61040f565b60405161010a91906116e2565b60405180910390f35b61012d600480360381019061012891906113ac565b610435565b60405161013a91906117a0565b60405180910390f35b600061015967b66ca0925dd3310d60c01b610595565b8160006101b17f6bdaeb2d29561f159c7ef98b16b27015fb2aeb87209c7ee656226d912f59927d83600001516040516020016101969291906117c2565b60405160208183030381529060405280519060200120610598565b905060006101c38284602001516105b2565b90503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461022a576040517f3093a27700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61023e676143dc0e15dc8cb960c01b610595565b610252673b094a26c359f88260c01b610595565b61026667e8bd8e1e6e01cd4360c01b610595565b61027a6790985789a64a898360c01b610595565b6102856002546105de565b63ffffffff169350505050919050565b6102a967e7c68f30b4d0e71460c01b610595565b6102bd6755fbb0eab61b4ca060c01b610595565b6102d16714fa7acbfd92d2d460c01b610595565b60006102e5826102e090611890565b6105f5565b90506102fb6793b850198f60234360c01b610595565b61030760025482610610565b6002819055505050565b600060608060008060006060610325610624565b61032d61065f565b46306000801b600067ffffffffffffffff81111561034e5761034d6111d0565b5b60405190808252806020026020018201604052801561037c5781602001602082028036833780820191505090505b507f0f00000000000000000000000000000000000000000000000000000000000000959493929190965096509650965096509650965090919293949596565b60006103d167d08b66433490730860c01b610595565b6103e5675e663632b5afbe5a60c01b610595565b6103f9675aaab89ba3f84f8860c01b610595565b6104046002546105de565b63ffffffff16905090565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b61043d611189565b610451677d2ca1ac498da3a860c01b610595565b8160006104a97f6bdaeb2d29561f159c7ef98b16b27015fb2aeb87209c7ee656226d912f59927d836000015160405160200161048e9291906117c2565b60405160208183030381529060405280519060200120610598565b905060006104bb8284602001516105b2565b90503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610522576040517f3093a27700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61053667a6329c8f73c21bee60c01b610595565b61054a67e4055a713d150f7c60c01b610595565b61055e67457d6281aa68dac660c01b610595565b61057267c05ff9418fbd1df460c01b610595565b61058b856000015160025461069a90919063ffffffff16565b9350505050919050565b50565b60006105ab6105a5610708565b836107bf565b9050919050565b6000806000806105c28686610800565b9250925092506105d2828261085c565b82935050505092915050565b60006105ee8263800000006109c0565b9050919050565b600061060982600001518360200151610a92565b9050919050565b600061061c8383610aa8565b905092915050565b606061065a60007f0000000000000000000000000000000000000000000000000000000000000000610b2090919063ffffffff16565b905090565b606061069560017f0000000000000000000000000000000000000000000000000000000000000000610b2090919063ffffffff16565b905090565b6106a2611189565b6106b66749b81c09fb26938d60c01b610bd0565b6106ca6795ab8db708ba7fde60c01b610bd0565b6106de67e11bb7635c65b9f860c01b610bd0565b60405180604001604052806106f38585610bd3565b8152602001600260ff16815250905092915050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1614801561078457507f000000000000000000000000000000000000000000000000000000000000000046145b156107b1577f000000000000000000000000000000000000000000000000000000000000000090506107bc565b6107b9610c09565b90505b90565b60006040517f190100000000000000000000000000000000000000000000000000000000000081528360028201528260228201526042812091505092915050565b600080600060418451036108455760008060006020870151925060408701519150606087015160001a905061083788828585610c9f565b955095509550505050610855565b60006002855160001b9250925092505b9250925092565b600060038111156108705761086f6118a3565b5b826003811115610883576108826118a3565b5b03156109bc576001600381111561089d5761089c6118a3565b5b8260038111156108b0576108af6118a3565b5b036108e7576040517ff645eedf00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600260038111156108fb576108fa6118a3565b5b82600381111561090e5761090d6118a3565b5b03610953578060001c6040517ffce698f700000000000000000000000000000000000000000000000000000000815260040161094a919061140e565b60405180910390fd5b600380811115610966576109656118a3565b5b826003811115610979576109786118a3565b5b036109bb57806040517fd78bce0c0000000000000000000000000000000000000000000000000000000081526004016109b291906118d2565b60405180910390fd5b5b5050565b60006109cb83610d93565b6109dc576109d96000610da0565b92505b60008263ffffffff169050600084905060006109f782610db6565b90506000608073ffffffffffffffffffffffffffffffffffffffff16637c4697ab600284876040518463ffffffff1660e01b8152600401610a3a93929190611951565b602060405180830381865afa158015610a57573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a7b91906119bb565b9050610a8681610e13565b94505050505092915050565b6000610aa083600284610e1d565b905092915050565b6000610ab383610d93565b610ac457610ac16000610da0565b92505b610acd82610d93565b610ade57610adb6000610da0565b91505b600083905060008390506000610b1260028484608073ffffffffffffffffffffffffffffffffffffffff16622df619610eba565b905080935050505092915050565b606060ff60001b8314610b3d57610b3683610f4e565b9050610bca565b818054610b4990611a17565b80601f0160208091040260200160405190810160405280929190818152602001828054610b7590611a17565b8015610bc25780601f10610b9757610100808354040283529160200191610bc2565b820191906000526020600020905b815481529060010190602001808311610ba557829003601f168201915b505050505090505b92915050565b50565b6060610bde83610d93565b610bef57610bec6000610da0565b92505b6000839050610c0060028285610fc2565b91505092915050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f7f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000004630604051602001610c84959493929190611a48565b60405160208183030381529060405280519060200120905090565b60008060007f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08460001c1115610cdf576000600385925092509250610d89565b600060018888888860405160008152602001604052604051610d049493929190611a9b565b6020604051602081039080840390855afa158015610d26573d6000803e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610d7a57600060016000801b93509350935050610d89565b8060008060001b935093509350505b9450945094915050565b6000808214159050919050565b6000610daf8260026000611078565b9050919050565b6060602067ffffffffffffffff811115610dd357610dd26111d0565b5b6040519080825280601f01601f191660200182016040528015610e055781602001600182028036833780820191505090505b509050816020820152919050565b6000819050919050565b60006060608073ffffffffffffffffffffffffffffffffffffffff166321b50ba38587866040518463ffffffff1660e01b8152600401610e5f93929190611aef565b600060405180830381865afa158015610e7c573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250810190610ea59190611b9d565b9050610eb08161111d565b9150509392505050565b60006060838388610eca89610db6565b610ed389610db6565b6040518463ffffffff1660e01b8152600401610ef193929190611be6565b600060405180830381865afa158015610f0e573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250810190610f379190611b9d565b9050610f428161112b565b91505095945050505050565b60606000610f5b83611139565b90506000602067ffffffffffffffff811115610f7a57610f796111d0565b5b6040519080825280601f01601f191660200182016040528015610fac5781602001600182028036833780820191505090505b5090508181528360208201528092505050919050565b6060608073ffffffffffffffffffffffffffffffffffffffff1663a1848ff385610feb86610db6565b85604051602001610ffc9190611c4c565b6040516020818303038152906040526040518463ffffffff1660e01b815260040161102993929190611be6565b600060405180830381865afa158015611046573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525081019061106f9190611d08565b90509392505050565b60006060608073ffffffffffffffffffffffffffffffffffffffff1663ba19ac286110a287610db6565b86866040518463ffffffff1660e01b81526004016110c293929190611d51565b600060405180830381865afa1580156110df573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906111089190611b9d565b90506111138161111d565b9150509392505050565b600060208201519050919050565b600060208201519050919050565b60008060ff8360001c169050601f811115611180576040517fb3512b0c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80915050919050565b604051806040016040528060608152602001600060ff1681525090565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611208826111bf565b810181811067ffffffffffffffff82111715611227576112266111d0565b5b80604052505050565b600061123a6111a6565b905061124682826111ff565b919050565b600080fd5b6000819050919050565b61126381611250565b811461126e57600080fd5b50565b6000813590506112808161125a565b92915050565b600080fd5b600080fd5b600067ffffffffffffffff8211156112ab576112aa6111d0565b5b6112b4826111bf565b9050602081019050919050565b82818337600083830152505050565b60006112e36112de84611290565b611230565b9050828152602081018484840111156112ff576112fe61128b565b5b61130a8482856112c1565b509392505050565b600082601f83011261132757611326611286565b5b81356113378482602086016112d0565b91505092915050565b600060408284031215611356576113556111ba565b5b6113606040611230565b9050600061137084828501611271565b600083015250602082013567ffffffffffffffff8111156113945761139361124b565b5b6113a084828501611312565b60208301525092915050565b6000602082840312156113c2576113c16111b0565b5b600082013567ffffffffffffffff8111156113e0576113df6111b5565b5b6113ec84828501611340565b91505092915050565b6000819050919050565b611408816113f5565b82525050565b600060208201905061142360008301846113ff565b92915050565b600080fd5b60006040828403121561144457611443611429565b5b81905092915050565b600060208284031215611463576114626111b0565b5b600082013567ffffffffffffffff811115611481576114806111b5565b5b61148d8482850161142e565b91505092915050565b60007fff0000000000000000000000000000000000000000000000000000000000000082169050919050565b6114cb81611496565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561150b5780820151818401526020810190506114f0565b60008484015250505050565b6000611522826114d1565b61152c81856114dc565b935061153c8185602086016114ed565b611545816111bf565b840191505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061157b82611550565b9050919050565b61158b81611570565b82525050565b61159a81611250565b82525050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6115d5816113f5565b82525050565b60006115e783836115cc565b60208301905092915050565b6000602082019050919050565b600061160b826115a0565b61161581856115ab565b9350611620836115bc565b8060005b8381101561165157815161163888826115db565b9750611643836115f3565b925050600181019050611624565b5085935050505092915050565b600060e082019050611673600083018a6114c2565b81810360208301526116858189611517565b905081810360408301526116998188611517565b90506116a860608301876113ff565b6116b56080830186611582565b6116c260a0830185611591565b81810360c08301526116d48184611600565b905098975050505050505050565b60006020820190506116f76000830184611582565b92915050565b600082825260208201905092915050565b6000611719826114d1565b61172381856116fd565b93506117338185602086016114ed565b61173c816111bf565b840191505092915050565b600060ff82169050919050565b61175d81611747565b82525050565b60006040830160008301518482036000860152611780828261170e565b91505060208301516117956020860182611754565b508091505092915050565b600060208201905081810360008301526117ba8184611763565b905092915050565b60006040820190506117d76000830185611591565b6117e46020830184611591565b9392505050565b60008160030b9050919050565b611801816117eb565b811461180c57600080fd5b50565b60008135905061181e816117f8565b92915050565b60006040828403121561183a576118396111ba565b5b6118446040611230565b9050600082013567ffffffffffffffff8111156118645761186361124b565b5b61187084828501611312565b60008301525060206118848482850161180f565b60208301525092915050565b600061189c3683611824565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60006020820190506118e76000830184611591565b92915050565b6118f681611747565b82525050565b600081519050919050565b600082825260208201905092915050565b6000611923826118fc565b61192d8185611907565b935061193d8185602086016114ed565b611946816111bf565b840191505092915050565b600060608201905061196660008301866118ed565b81810360208301526119788185611918565b905061198760408301846113ff565b949350505050565b611998816113f5565b81146119a357600080fd5b50565b6000815190506119b58161198f565b92915050565b6000602082840312156119d1576119d06111b0565b5b60006119df848285016119a6565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611a2f57607f821691505b602082108103611a4257611a416119e8565b5b50919050565b600060a082019050611a5d6000830188611591565b611a6a6020830187611591565b611a776040830186611591565b611a8460608301856113ff565b611a916080830184611582565b9695505050505050565b6000608082019050611ab06000830187611591565b611abd60208301866118ed565b611aca6040830185611591565b611ad76060830184611591565b95945050505050565b611ae9816117eb565b82525050565b6000606082019050611b0460008301866118ed565b8181036020830152611b168185611918565b9050611b256040830184611ae0565b949350505050565b6000611b40611b3b84611290565b611230565b905082815260208101848484011115611b5c57611b5b61128b565b5b611b678482856114ed565b509392505050565b600082601f830112611b8457611b83611286565b5b8151611b94848260208601611b2d565b91505092915050565b600060208284031215611bb357611bb26111b0565b5b600082015167ffffffffffffffff811115611bd157611bd06111b5565b5b611bdd84828501611b6f565b91505092915050565b6000606082019050611bfb60008301866118ed565b8181036020830152611c0d8185611918565b90508181036040830152611c218184611918565b9050949350505050565b6000819050919050565b611c46611c4182611250565b611c2b565b82525050565b6000611c588284611c35565b60208201915081905092915050565b600067ffffffffffffffff821115611c8257611c816111d0565b5b611c8b826111bf565b9050602081019050919050565b6000611cab611ca684611c67565b611230565b905082815260208101848484011115611cc757611cc661128b565b5b611cd28482856114ed565b509392505050565b600082601f830112611cef57611cee611286565b5b8151611cff848260208601611c98565b91505092915050565b600060208284031215611d1e57611d1d6111b0565b5b600082015167ffffffffffffffff811115611d3c57611d3b6111b5565b5b611d4884828501611cda565b91505092915050565b60006060820190508181036000830152611d6b8186611918565b9050611d7a60208301856118ed565b611d876040830184611ae0565b94935050505056fea26469706673582212203c37302171519ea99d1c5f2e7b44785fa7fe294d817410c8838dbbefc66f779764736f6c63430008140033";

type CounterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CounterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Counter__factory extends ContractFactory {
  constructor(...args: CounterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Counter & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Counter__factory {
    return super.connect(runner) as Counter__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CounterInterface {
    return new Interface(_abi) as CounterInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Counter {
    return new Contract(address, _abi, runner) as unknown as Counter;
  }
}
