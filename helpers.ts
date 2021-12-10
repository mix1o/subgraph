import axios, { AxiosResponse } from "axios";
import { providers } from "ethers";
import { readFile, writeFile } from "fs/promises";
import { render } from "mustache";
import { exec as execBase } from "child_process";
import {
  Borrower,
  FlashLoan,
  LpToken,
  MyToken,
  Pool,
} from "./rainbow-abis/src/typechain";

export async function getLastBlock(provider: providers.Provider) {
  return provider.getBlock(await provider.getBlockNumber());
}

export function getSigners(
  provider: providers.JsonRpcProvider
): providers.JsonRpcSigner[] {
  const signers: providers.JsonRpcSigner[] = [];

  for (let index = 0; index < 10; index++) {
    signers.push(provider.getSigner(index));
  }

  return signers;
}

export function execAsync(command: string) {
  return new Promise<string>((resolve, reject) => {
    return execBase(command, (err, stdout, stderr) => {
      // console.log(stdout);
      // console.log(stdout);
      if (err) {
        return reject(err || stderr);
      }

      return resolve(stdout);
    });
  });
}

export function wait(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

export async function waitForSubgraphUp(timeout = 10000) {
  let retryCt = 0;
  let success = false;

  const consoleError = console.error;
  console.error = () => {};

  while (retryCt * 100 < timeout) {
    try {
      await wait(100);
      const { data } = await axios.post("http://localhost:8030/graphql", {
        query: `{
              indexingStatuses {
                subgraph
              }
          }`,
      });

      if (data) {
        success = true;
        console.error = consoleError;
        break;
      }
    } catch (e) {}

    retryCt++;
  }
}

interface WaitForGraphSyncParams {
  provider: providers.JsonRpcProvider;
  targetBlockNumber?: number;
  subgraphName: string;
}

export async function waitForGraphSync({
  provider,
  targetBlockNumber,
  subgraphName,
}: WaitForGraphSyncParams) {
  targetBlockNumber =
    targetBlockNumber || (await getLastBlock(provider)).number;
  let isSynced = false;

  console.info(
    `Waiting for subgraph "${subgraphName}" to sync block #${targetBlockNumber}`
  );

  while (true) {
    try {
      await wait(100);
      const {
        data: {
          data: { indexingStatusForCurrentVersion },
        },
      } = await axios.post("http://localhost:8030/graphql", {
        query: `{
            indexingStatusForCurrentVersion(subgraphName: "${subgraphName}") {
            synced
            chains {
              chainHeadBlock {
                number
              }
              latestBlock {
                number
              }
            }
          }
        }`,
      });

      if (
        indexingStatusForCurrentVersion.synced &&
        indexingStatusForCurrentVersion.chains[0].latestBlock.number ==
          targetBlockNumber
      ) {
        console.info(
          `Subgraph "${subgraphName}" has synced with block #${targetBlockNumber}`
        );
        isSynced = true;
        break;
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export interface BuildSubgraphYmlProps {
  network: string | "mainnet" | "ropsten" | "rinkeby" | "kovan" | "local";
  startBlock: number;
  contracts: {
    pool: {
      address: string;
    };
    lpToken: {
      address: string;
    };
    myToken: {
      address: string;
    };
    flashLoan: {
      address: string;
    };
  };
}

export async function buildSubgraphYaml(viewProps: BuildSubgraphYmlProps) {
  const subgraphYamlTemplate = await readFile("./subgraph.template.yaml", {
    encoding: "utf8",
  });
  const subgraphYamlOut = render(subgraphYamlTemplate, viewProps);
  await writeFile("./subgraph.yaml", subgraphYamlOut);
}

export async function querySubgraph(query: string) {
  const res = await axios.post(
    `http://localhost:8000/subgraphs/name/rainbow/subgraph`,
    {
      query,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (res.data?.data && !res.data?.errors?.length) {
    return res.data;
  } else {
    console.log(res.data.errors);
    throw new Error(`Query failed`);
  }
}
export interface JestBeforeEachContext {
  provider: providers.JsonRpcProvider;
  querySubgraph: (query: string) => Promise<AxiosResponse>;
  waitForSubgraphSync: (targetBlockNumber?: number) => Promise<void>;
  pool: Pool;
  myToken: MyToken;
  lpToken: LpToken;
  flashLoan: FlashLoan;
  borrower: Borrower;
  deployerAddress: string;
  user: providers.JsonRpcSigner;
  userAddress: string;
}
