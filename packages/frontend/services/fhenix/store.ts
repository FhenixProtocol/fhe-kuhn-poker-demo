import { BrowserProvider, Eip1193Provider, JsonRpcProvider } from "ethers";
import { FhenixClientSync, Permit } from "fhenixjs";
import { useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import create from "zustand";
import { immer } from "zustand/middleware/immer";

type ContractAccountKey = `0x${string}_0x${string}`;
type FhenixState = {
  initializedAccount: string | undefined;
  provider: JsonRpcProvider | BrowserProvider | undefined;
  client: FhenixClientSync | undefined;
  contractAccountPermits: Record<ContractAccountKey, Permit>;
};

export const useFhenixState = create<FhenixState>()(
  immer(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set, get): FhenixState => ({
      initializedAccount: undefined,
      provider: undefined,
      client: undefined,
      contractAccountPermits: {},
    }),
  ),
);

export const initFhenixClient = async (account: `0x${string}` | undefined) => {
  if (account === useFhenixState.getState().initializedAccount && useFhenixState.getState().provider != null) return;

  // Initialize the provider.
  // @todo: Find a way not to use ethers.BrowserProvider because we already have viem and wagmi here.
  const provider = new BrowserProvider(window.ethereum as Eip1193Provider);

  // @ts-expect-error Type mismatch on `provider.send`
  const client = await FhenixClientSync.create({ provider });

  const loadedPermits = account == null ? null : client.loadAllPermitsFromLocalStorage(account);

  const loadedPermitsWithAccount: Record<ContractAccountKey, Permit> = {};
  if (loadedPermits != null && account != null) {
    Object.entries(loadedPermits).forEach(([contractAddress, permit]) => {
      const key: ContractAccountKey = `${contractAddress as `0x${string}`}_${account}`;
      loadedPermitsWithAccount[key] = permit;
    });
  }

  useFhenixState.setState({
    initializedAccount: account,
    provider,
    client,
    contractAccountPermits: loadedPermitsWithAccount,
  });
};

export const getOrCreateFhenixPermit = async (contractAddress?: `0x${string}`, account?: `0x${string}`) => {
  if (contractAddress == null || account == null) return;

  const client = useFhenixState.getState().client;
  if (client == null || contractAddress == null || account == null) return;

  let permit = client.getPermit(contractAddress, account);
  if (permit == null) {
    permit = await client.generatePermit(contractAddress);
  }

  useFhenixState.setState(draft => {
    draft.contractAccountPermits[`${contractAddress}_${account}`] = permit;
  });
};

export const getFhenixPermit = (contractAddress: `0x${string}`, account: `0x${string}`) => {
  const key: ContractAccountKey = `${contractAddress}_${account}`;
  return useFhenixState.getState().contractAccountPermits[key];
};

// HOOKS

export const useInitFhenixClient = () => {
  return useCallback((account: `0x${string}` | undefined) => initFhenixClient(account), []);
};
export const useCreateFhenixPermit = () => {
  return useCallback(getOrCreateFhenixPermit, []);
};

export const useFhenix = () => {
  return useFhenixState(state => ({ fhenixClient: state.client, fhenixProvider: state.provider }));
};
export const useFhenixPermit = (contractAddress: `0x${string}` | undefined, account: `0x${string}` | undefined) => {
  return useFhenixState(state => {
    if (contractAddress == null || account == null) return { permit: undefined, permission: undefined };

    const key: ContractAccountKey = `${contractAddress}_${account}`;
    const permit = state.contractAccountPermits[key];

    if (permit == null || state.client == null) return { permit: undefined, permission: undefined };

    return {
      permit,
      permission: state.client?.extractPermitPermission(permit),
    };
  });
};

// WAGMI hooks (useAccount)
export const useWagmiInitFhenixClient = () => {
  const { address } = useAccount();
  const initFhenixClient = useInitFhenixClient();

  useEffect(() => {
    initFhenixClient(address);
  }, [address, initFhenixClient]);
};
