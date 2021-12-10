import { providers } from "ethers";
import { EVM_ENDPOINT } from "../constants/evm";
import {
  waitForSubgraphUp,
  buildSubgraphYaml,
  BuildSubgraphYmlProps,
  execAsync,
  waitForGraphSync,
  querySubgraph,
} from "../helpers";
import {
  Pool,
  MyToken,
  LpToken,
  FlashLoan,
  Pool__factory,
  MyToken__factory,
  LpToken__factory,
  FlashLoan__factory,
  Borrower,
  Borrower__factory,
} from "../rainbow-abis/src/typechain";
import { upAll as upDockerCompose } from "docker-compose";
import { parseUnits } from "@ethersproject/units";

export async function jestBeforeAll() {
  try {
    upDockerCompose();
  } catch (e) {
    process.exit(1);
  }
  await waitForSubgraphUp();
}

export async function jestBeforeEach() {
  const provider = new providers.JsonRpcProvider(EVM_ENDPOINT);

  const deployer = provider.getSigner(0);
  const deployerAddress = await deployer.getAddress();

  const user = provider.getSigner(1);
  const userAddress = await user.getAddress();

  // const [deployer, user] = provider.getSigners;

  let pool: Pool;
  let myToken: MyToken;
  let lpToken: LpToken;
  let flashLoan: FlashLoan;
  let borrower: Borrower;

  pool = await new Pool__factory(deployer).deploy();

  myToken = await new MyToken__factory(deployer).deploy("MyToken", "MTK");
  lpToken = await new LpToken__factory(deployer).deploy(
    "LpToken",
    "LPT",
    pool.address,
    myToken.address
  );
  flashLoan = await new FlashLoan__factory(deployer).deploy(100, pool.address);
  borrower = await new Borrower__factory(user).deploy();

  const buildSubgraphYamlConfig: BuildSubgraphYmlProps = {
    network: "local",
    startBlock: pool.deployTransaction.blockNumber as number,
    contracts: {
      pool: {
        address: pool.address,
      },
      lpToken: {
        address: lpToken.address,
      },
      myToken: {
        address: myToken.address,
      },
      flashLoan: {
        address: flashLoan.address,
      },
    },
  };

  await buildSubgraphYaml(buildSubgraphYamlConfig);

  await execAsync("yarn codegen");
  await execAsync("yarn build");
  await execAsync("yarn create-local");
  await execAsync("yarn deploy-local");

  await waitForGraphSync({
    subgraphName: "rainbow/subgraph",
    provider,
  });

  return {
    waitForSubgraphSync: (targetBlockNumber?: number) =>
      waitForGraphSync({
        provider,
        subgraphName: "rainbow/subgraph",
        targetBlockNumber,
      }),
    querySubgraph: (query: string) => querySubgraph(query),
    provider,
    pool,
    myToken,
    lpToken,
    flashLoan,
    borrower,
    deployerAddress,
    user,
    userAddress,
  };
}

export async function jestAfterAll() {
  await execAsync("yarn remove-local");
}
